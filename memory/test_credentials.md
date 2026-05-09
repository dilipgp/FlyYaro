# FlyYaro — Test Credentials

## Seeded Email/Password Accounts

| Email                    | Password    | Notes                          |
|--------------------------|-------------|--------------------------------|
| dilip@flyyaro.com        | Pass1234!   | Created via /api/auth/register |

You can register additional accounts via `POST /api/auth/register`.

## Google OAuth (Emergent Managed)

- No app-managed passwords. Use any Google account.
- Login button on `/login` redirects to `https://auth.emergentagent.com/?redirect=<origin>/auth/callback`.
- After Google completes, app lands on `/auth/callback#session_id=...` and the backend
  exchanges the `session_id` for a `session_token` cookie.

## Cookie / Session
- Cookie name: `session_token` (httpOnly, secure, samesite=none, 7-day TTL)
- Bearer header is also accepted: `Authorization: Bearer <session_token>`

## Auth Endpoints
- `POST /api/auth/register` — `{ name, email, password }` → user + sets cookie
- `POST /api/auth/login` — `{ email, password }` → user + sets cookie
- `POST /api/auth/google/session` — `{ session_id }` → user + sets cookie
- `GET  /api/auth/me` — current user (401 if not signed in)
- `POST /api/auth/logout` — clears cookie + deletes session row
