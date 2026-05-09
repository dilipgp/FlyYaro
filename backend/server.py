"""FlyYaro backend — FastAPI app with Emergent Google Auth + email/password auth."""
from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, Cookie
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
import re
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone, timedelta
import bcrypt
import httpx


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

EMERGENT_SESSION_DATA_URL = "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data"
SESSION_TTL_DAYS = 7
COOKIE_NAME = "session_token"

app = FastAPI(title="FlyYaro API")
api_router = APIRouter(prefix="/api")


# -----------------------------
# Models
# -----------------------------
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    provider: str  # "google" | "email"
    created_at: datetime


class GoogleSessionRequest(BaseModel):
    session_id: str


class RegisterRequest(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# -----------------------------
# Helpers
# -----------------------------
def _hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def _verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def _new_session_token() -> str:
    return f"flyyaro_{uuid.uuid4().hex}{uuid.uuid4().hex}"


def _new_user_id() -> str:
    return f"user_{uuid.uuid4().hex[:12]}"


def _set_session_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        max_age=SESSION_TTL_DAYS * 24 * 60 * 60,
        path="/",
        httponly=True,
        secure=True,
        samesite="none",
    )


def _clear_session_cookie(response: Response) -> None:
    response.delete_cookie(key=COOKIE_NAME, path="/", samesite="none", secure=True)


async def _create_session(user_id: str) -> str:
    token = _new_session_token()
    expires_at = datetime.now(timezone.utc) + timedelta(days=SESSION_TTL_DAYS)
    await db.user_sessions.insert_one({
        "user_id": user_id,
        "session_token": token,
        "expires_at": expires_at.isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return token


async def _user_to_response(user_doc: dict) -> dict:
    return {
        "user_id": user_doc["user_id"],
        "email": user_doc["email"],
        "name": user_doc["name"],
        "picture": user_doc.get("picture"),
        "provider": user_doc.get("provider", "email"),
        "created_at": user_doc.get("created_at"),
    }


async def get_current_user(request: Request) -> dict:
    """Extract session token from cookie or Authorization header, return user doc."""
    token: Optional[str] = request.cookies.get(COOKIE_NAME)
    if not token:
        auth = request.headers.get("Authorization") or request.headers.get("authorization")
        if auth and auth.lower().startswith("bearer "):
            token = auth.split(" ", 1)[1].strip()
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    session = await db.user_sessions.find_one({"session_token": token}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")

    expires_at = session.get("expires_at")
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at and expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at and expires_at < datetime.now(timezone.utc):
        await db.user_sessions.delete_one({"session_token": token})
        raise HTTPException(status_code=401, detail="Session expired")

    user = await db.users.find_one({"user_id": session["user_id"]}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


# -----------------------------
# Routes (existing)
# -----------------------------
@api_router.get("/")
async def root():
    return {"message": "FlyYaro API"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check.get('timestamp'), str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


# -----------------------------
# Auth Routes
# -----------------------------
@api_router.post("/auth/google/session")
async def google_session(payload: GoogleSessionRequest, response: Response):
    """Exchange a one-time session_id (from Emergent OAuth fragment) for a persistent session.

    REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    """
    if not payload.session_id or len(payload.session_id) < 5:
        raise HTTPException(status_code=400, detail="Invalid session_id")

    # Call Emergent's session-data endpoint server-side (never from frontend)
    try:
        async with httpx.AsyncClient(timeout=15.0) as http:
            r = await http.get(
                EMERGENT_SESSION_DATA_URL,
                headers={"X-Session-ID": payload.session_id},
            )
    except Exception as e:
        logger.exception("Emergent session-data call failed")
        raise HTTPException(status_code=502, detail=f"Auth provider unreachable: {e}")

    if r.status_code != 200:
        logger.warning("Emergent session exchange failed: %s %s", r.status_code, r.text[:200])
        raise HTTPException(status_code=401, detail="Failed to verify Google session")

    data = r.json()
    email = data.get("email")
    name = data.get("name") or (email.split("@")[0] if email else "Yaro user")
    picture = data.get("picture")
    provider_session_token = data.get("session_token")

    if not email:
        raise HTTPException(status_code=400, detail="Email missing from Google profile")

    # Upsert user by email
    existing = await db.users.find_one({"email": email}, {"_id": 0})
    if existing:
        user_id = existing["user_id"]
        update_doc = {
            "name": name,
            "picture": picture,
            "provider": existing.get("provider", "google"),
            "last_login_at": datetime.now(timezone.utc).isoformat(),
        }
        await db.users.update_one({"user_id": user_id}, {"$set": update_doc})
        user_doc = {**existing, **update_doc}
    else:
        user_id = _new_user_id()
        user_doc = {
            "user_id": user_id,
            "email": email,
            "name": name,
            "picture": picture,
            "provider": "google",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "last_login_at": datetime.now(timezone.utc).isoformat(),
            "password_hash": None,
        }
        await db.users.insert_one(user_doc.copy())

    # Use Emergent's session_token if provided; otherwise mint our own
    token = provider_session_token or _new_session_token()
    expires_at = datetime.now(timezone.utc) + timedelta(days=SESSION_TTL_DAYS)
    await db.user_sessions.insert_one({
        "user_id": user_id,
        "session_token": token,
        "expires_at": expires_at.isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "provider": "google",
    })

    _set_session_cookie(response, token)
    return await _user_to_response(user_doc)


@api_router.post("/auth/register")
async def register(payload: RegisterRequest, response: Response):
    """Email/password sign-up — creates user and issues session cookie."""
    email = payload.email.lower().strip()
    name = payload.name.strip()

    existing = await db.users.find_one({"email": email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    user_id = _new_user_id()
    user_doc = {
        "user_id": user_id,
        "email": email,
        "name": name,
        "picture": None,
        "provider": "email",
        "password_hash": _hash_password(payload.password),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "last_login_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.users.insert_one(user_doc.copy())

    token = await _create_session(user_id)
    _set_session_cookie(response, token)
    return await _user_to_response(user_doc)


@api_router.post("/auth/login")
async def login(payload: LoginRequest, response: Response):
    """Email/password login — verifies credentials and issues session cookie."""
    email = payload.email.lower().strip()
    user_doc = await db.users.find_one({"email": email}, {"_id": 0})
    if not user_doc or not user_doc.get("password_hash"):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not _verify_password(payload.password, user_doc["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    await db.users.update_one(
        {"user_id": user_doc["user_id"]},
        {"$set": {"last_login_at": datetime.now(timezone.utc).isoformat()}},
    )

    token = await _create_session(user_doc["user_id"])
    _set_session_cookie(response, token)
    return await _user_to_response(user_doc)


@api_router.get("/auth/me")
async def auth_me(user: dict = Depends(get_current_user)):
    return await _user_to_response(user)


@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    token = request.cookies.get(COOKIE_NAME)
    if not token:
        auth = request.headers.get("Authorization") or ""
        if auth.lower().startswith("bearer "):
            token = auth.split(" ", 1)[1].strip()
    if token:
        await db.user_sessions.delete_one({"session_token": token})
    _clear_session_cookie(response)
    return {"ok": True}


# Include router
app.include_router(api_router)

# CORS — allow credentials for cookie-based auth
_cors_env = os.environ.get('CORS_ORIGINS', '*')
_origins = [o.strip() for o in _cors_env.split(',') if o.strip()]
# When using credentials with cookies, '*' is not allowed by browsers; use origin regex.
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=".*" if _origins == ["*"] else None,
    allow_origins=_origins if _origins != ["*"] else [],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
