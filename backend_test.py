#!/usr/bin/env python3
"""
FlyYaro Backend Auth Testing Suite
Tests all authentication endpoints with real API calls
"""
import requests
import json
import sys
from datetime import datetime

# Use the external URL for testing
BASE_URL = "https://repo-refresh-hub.preview.emergentagent.com/api"

# Test credentials from test_credentials.md
EXISTING_USER_EMAIL = "dilip@flyyaro.com"
EXISTING_USER_PASSWORD = "Pass1234!"

# Colors for output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'

test_results = {
    "passed": 0,
    "failed": 0,
    "tests": []
}

def log_test(name, passed, details=""):
    """Log test result"""
    status = f"{GREEN}✅ PASS{RESET}" if passed else f"{RED}❌ FAIL{RESET}"
    print(f"{status} - {name}")
    if details:
        print(f"    {details}")
    
    test_results["tests"].append({
        "name": name,
        "passed": passed,
        "details": details
    })
    if passed:
        test_results["passed"] += 1
    else:
        test_results["failed"] += 1

def test_root_endpoint():
    """Test GET /api/"""
    print(f"\n{BLUE}Testing GET /api/{RESET}")
    try:
        r = requests.get(f"{BASE_URL}/", timeout=10)
        if r.status_code == 200 and r.json().get("message") == "FlyYaro API":
            log_test("GET /api/", True, f"Response: {r.json()}")
            return True
        else:
            log_test("GET /api/", False, f"Status: {r.status_code}, Body: {r.text}")
            return False
    except Exception as e:
        log_test("GET /api/", False, f"Exception: {str(e)}")
        return False

def test_status_endpoints():
    """Test POST and GET /api/status"""
    print(f"\n{BLUE}Testing /api/status endpoints{RESET}")
    
    # Test POST
    try:
        payload = {"client_name": "backend_test_suite"}
        r = requests.post(f"{BASE_URL}/status", json=payload, timeout=10)
        if r.status_code == 200:
            data = r.json()
            if "id" in data and data.get("client_name") == "backend_test_suite":
                log_test("POST /api/status", True, f"Created status check with id: {data['id']}")
            else:
                log_test("POST /api/status", False, f"Missing fields in response: {data}")
        else:
            log_test("POST /api/status", False, f"Status: {r.status_code}, Body: {r.text}")
    except Exception as e:
        log_test("POST /api/status", False, f"Exception: {str(e)}")
    
    # Test GET
    try:
        r = requests.get(f"{BASE_URL}/status", timeout=10)
        if r.status_code == 200:
            data = r.json()
            if isinstance(data, list):
                log_test("GET /api/status", True, f"Retrieved {len(data)} status checks")
            else:
                log_test("GET /api/status", False, f"Expected list, got: {type(data)}")
        else:
            log_test("GET /api/status", False, f"Status: {r.status_code}, Body: {r.text}")
    except Exception as e:
        log_test("GET /api/status", False, f"Exception: {str(e)}")

def test_register_valid():
    """Test POST /api/auth/register with valid data"""
    print(f"\n{BLUE}Testing POST /api/auth/register (valid){RESET}")
    
    # Use unique email with timestamp
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    payload = {
        "name": "Test User",
        "email": f"newtest{timestamp}@flyyaro.com",
        "password": "StrongPass1!"
    }
    
    try:
        r = requests.post(f"{BASE_URL}/auth/register", json=payload, timeout=10)
        if r.status_code == 200:
            data = r.json()
            # Check required fields
            required_fields = ["user_id", "email", "name", "provider"]
            missing = [f for f in required_fields if f not in data]
            
            if missing:
                log_test("Register valid user", False, f"Missing fields: {missing}, Response: {data}")
                return None
            
            if data.get("provider") != "email":
                log_test("Register valid user", False, f"Expected provider='email', got: {data.get('provider')}")
                return None
            
            # Check for session cookie
            cookie = r.cookies.get("session_token")
            if not cookie:
                log_test("Register valid user", False, "No session_token cookie set")
                return None
            
            log_test("Register valid user", True, f"User created: {data['email']}, Cookie set: {cookie[:20]}...")
            return {"email": payload["email"], "password": payload["password"], "cookie": cookie}
        else:
            log_test("Register valid user", False, f"Status: {r.status_code}, Body: {r.text}")
            return None
    except Exception as e:
        log_test("Register valid user", False, f"Exception: {str(e)}")
        return None

def test_register_duplicate(email):
    """Test POST /api/auth/register with duplicate email"""
    print(f"\n{BLUE}Testing POST /api/auth/register (duplicate email){RESET}")
    
    payload = {
        "name": "Duplicate User",
        "email": email,
        "password": "AnotherPass1!"
    }
    
    try:
        r = requests.post(f"{BASE_URL}/auth/register", json=payload, timeout=10)
        if r.status_code == 400:
            data = r.json()
            if "already exists" in data.get("detail", "").lower():
                log_test("Register duplicate email", True, f"Correctly rejected: {data['detail']}")
                return True
            else:
                log_test("Register duplicate email", False, f"Wrong error message: {data.get('detail')}")
                return False
        else:
            log_test("Register duplicate email", False, f"Expected 400, got {r.status_code}: {r.text}")
            return False
    except Exception as e:
        log_test("Register duplicate email", False, f"Exception: {str(e)}")
        return False

def test_register_invalid_email():
    """Test POST /api/auth/register with invalid email format"""
    print(f"\n{BLUE}Testing POST /api/auth/register (invalid email){RESET}")
    
    payload = {
        "name": "Test User",
        "email": "not-an-email",
        "password": "StrongPass1!"
    }
    
    try:
        r = requests.post(f"{BASE_URL}/auth/register", json=payload, timeout=10)
        if r.status_code == 422:
            log_test("Register invalid email format", True, f"Correctly rejected with 422")
            return True
        else:
            log_test("Register invalid email format", False, f"Expected 422, got {r.status_code}: {r.text}")
            return False
    except Exception as e:
        log_test("Register invalid email format", False, f"Exception: {str(e)}")
        return False

def test_register_short_password():
    """Test POST /api/auth/register with password under 8 chars"""
    print(f"\n{BLUE}Testing POST /api/auth/register (short password){RESET}")
    
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    payload = {
        "name": "Test User",
        "email": f"test{timestamp}@flyyaro.com",
        "password": "Short1!"
    }
    
    try:
        r = requests.post(f"{BASE_URL}/auth/register", json=payload, timeout=10)
        if r.status_code == 422:
            log_test("Register short password", True, f"Correctly rejected with 422")
            return True
        else:
            log_test("Register short password", False, f"Expected 422, got {r.status_code}: {r.text}")
            return False
    except Exception as e:
        log_test("Register short password", False, f"Exception: {str(e)}")
        return False

def test_login_valid():
    """Test POST /api/auth/login with existing credentials"""
    print(f"\n{BLUE}Testing POST /api/auth/login (valid credentials){RESET}")
    
    payload = {
        "email": EXISTING_USER_EMAIL,
        "password": EXISTING_USER_PASSWORD
    }
    
    try:
        r = requests.post(f"{BASE_URL}/auth/login", json=payload, timeout=10)
        if r.status_code == 200:
            data = r.json()
            cookie = r.cookies.get("session_token")
            
            if not cookie:
                log_test("Login valid credentials", False, "No session_token cookie set")
                return None
            
            required_fields = ["user_id", "email", "name"]
            missing = [f for f in required_fields if f not in data]
            
            if missing:
                log_test("Login valid credentials", False, f"Missing fields: {missing}")
                return None
            
            log_test("Login valid credentials", True, f"Logged in as: {data['email']}, Cookie: {cookie[:20]}...")
            return {"user": data, "cookie": cookie}
        else:
            log_test("Login valid credentials", False, f"Status: {r.status_code}, Body: {r.text}")
            return None
    except Exception as e:
        log_test("Login valid credentials", False, f"Exception: {str(e)}")
        return None

def test_login_wrong_password():
    """Test POST /api/auth/login with wrong password"""
    print(f"\n{BLUE}Testing POST /api/auth/login (wrong password){RESET}")
    
    payload = {
        "email": EXISTING_USER_EMAIL,
        "password": "WrongPassword123!"
    }
    
    try:
        r = requests.post(f"{BASE_URL}/auth/login", json=payload, timeout=10)
        if r.status_code == 401:
            data = r.json()
            if "invalid email or password" in data.get("detail", "").lower():
                log_test("Login wrong password", True, f"Correctly rejected: {data['detail']}")
                return True
            else:
                log_test("Login wrong password", False, f"Wrong error message: {data.get('detail')}")
                return False
        else:
            log_test("Login wrong password", False, f"Expected 401, got {r.status_code}: {r.text}")
            return False
    except Exception as e:
        log_test("Login wrong password", False, f"Exception: {str(e)}")
        return False

def test_login_unknown_email():
    """Test POST /api/auth/login with unknown email"""
    print(f"\n{BLUE}Testing POST /api/auth/login (unknown email){RESET}")
    
    payload = {
        "email": "nonexistent@flyyaro.com",
        "password": "SomePassword1!"
    }
    
    try:
        r = requests.post(f"{BASE_URL}/auth/login", json=payload, timeout=10)
        if r.status_code == 401:
            data = r.json()
            if "invalid email or password" in data.get("detail", "").lower():
                log_test("Login unknown email", True, f"Correctly rejected (no user enumeration): {data['detail']}")
                return True
            else:
                log_test("Login unknown email", False, f"Wrong error message: {data.get('detail')}")
                return False
        else:
            log_test("Login unknown email", False, f"Expected 401, got {r.status_code}: {r.text}")
            return False
    except Exception as e:
        log_test("Login unknown email", False, f"Exception: {str(e)}")
        return False

def test_auth_me_without_cookie():
    """Test GET /api/auth/me without authentication"""
    print(f"\n{BLUE}Testing GET /api/auth/me (no auth){RESET}")
    
    try:
        r = requests.get(f"{BASE_URL}/auth/me", timeout=10)
        if r.status_code == 401:
            data = r.json()
            if "not authenticated" in data.get("detail", "").lower():
                log_test("GET /auth/me without cookie", True, f"Correctly rejected: {data['detail']}")
                return True
            else:
                log_test("GET /auth/me without cookie", False, f"Wrong error message: {data.get('detail')}")
                return False
        else:
            log_test("GET /auth/me without cookie", False, f"Expected 401, got {r.status_code}: {r.text}")
            return False
    except Exception as e:
        log_test("GET /auth/me without cookie", False, f"Exception: {str(e)}")
        return False

def test_auth_me_with_cookie(cookie):
    """Test GET /api/auth/me with valid cookie"""
    print(f"\n{BLUE}Testing GET /api/auth/me (with cookie){RESET}")
    
    try:
        cookies = {"session_token": cookie}
        r = requests.get(f"{BASE_URL}/auth/me", cookies=cookies, timeout=10)
        if r.status_code == 200:
            data = r.json()
            required_fields = ["user_id", "email", "name"]
            missing = [f for f in required_fields if f not in data]
            
            if missing:
                log_test("GET /auth/me with cookie", False, f"Missing fields: {missing}")
                return False
            
            log_test("GET /auth/me with cookie", True, f"Retrieved user: {data['email']}")
            return True
        else:
            log_test("GET /auth/me with cookie", False, f"Status: {r.status_code}, Body: {r.text}")
            return False
    except Exception as e:
        log_test("GET /auth/me with cookie", False, f"Exception: {str(e)}")
        return False

def test_auth_me_with_bearer(token):
    """Test GET /api/auth/me with Authorization Bearer header"""
    print(f"\n{BLUE}Testing GET /api/auth/me (with Bearer token){RESET}")
    
    try:
        headers = {"Authorization": f"Bearer {token}"}
        r = requests.get(f"{BASE_URL}/auth/me", headers=headers, timeout=10)
        if r.status_code == 200:
            data = r.json()
            required_fields = ["user_id", "email", "name"]
            missing = [f for f in required_fields if f not in data]
            
            if missing:
                log_test("GET /auth/me with Bearer", False, f"Missing fields: {missing}")
                return False
            
            log_test("GET /auth/me with Bearer", True, f"Retrieved user: {data['email']}")
            return True
        else:
            log_test("GET /auth/me with Bearer", False, f"Status: {r.status_code}, Body: {r.text}")
            return False
    except Exception as e:
        log_test("GET /auth/me with Bearer", False, f"Exception: {str(e)}")
        return False

def test_logout_with_cookie(cookie):
    """Test POST /api/auth/logout with valid cookie"""
    print(f"\n{BLUE}Testing POST /api/auth/logout (with cookie){RESET}")
    
    try:
        cookies = {"session_token": cookie}
        r = requests.post(f"{BASE_URL}/auth/logout", cookies=cookies, timeout=10)
        if r.status_code == 200:
            data = r.json()
            if data.get("ok") == True:
                # Check if cookie is cleared (should be in Set-Cookie header)
                set_cookie = r.headers.get("Set-Cookie", "")
                log_test("POST /auth/logout with cookie", True, f"Logout successful, cookie cleared: {bool(set_cookie)}")
                return True
            else:
                log_test("POST /auth/logout with cookie", False, f"Unexpected response: {data}")
                return False
        else:
            log_test("POST /auth/logout with cookie", False, f"Status: {r.status_code}, Body: {r.text}")
            return False
    except Exception as e:
        log_test("POST /auth/logout with cookie", False, f"Exception: {str(e)}")
        return False

def test_logout_without_cookie():
    """Test POST /api/auth/logout without cookie (idempotent)"""
    print(f"\n{BLUE}Testing POST /api/auth/logout (no cookie - idempotent){RESET}")
    
    try:
        r = requests.post(f"{BASE_URL}/auth/logout", timeout=10)
        if r.status_code == 200:
            data = r.json()
            if data.get("ok") == True:
                log_test("POST /auth/logout without cookie", True, "Idempotent logout successful")
                return True
            else:
                log_test("POST /auth/logout without cookie", False, f"Unexpected response: {data}")
                return False
        else:
            log_test("POST /auth/logout without cookie", False, f"Status: {r.status_code}, Body: {r.text}")
            return False
    except Exception as e:
        log_test("POST /auth/logout without cookie", False, f"Exception: {str(e)}")
        return False

def test_auth_me_after_logout(cookie):
    """Test GET /api/auth/me after logout (should be 401)"""
    print(f"\n{BLUE}Testing GET /api/auth/me (after logout){RESET}")
    
    try:
        cookies = {"session_token": cookie}
        r = requests.get(f"{BASE_URL}/auth/me", cookies=cookies, timeout=10)
        if r.status_code == 401:
            log_test("GET /auth/me after logout", True, "Correctly rejected after logout")
            return True
        else:
            log_test("GET /auth/me after logout", False, f"Expected 401, got {r.status_code}: {r.text}")
            return False
    except Exception as e:
        log_test("GET /auth/me after logout", False, f"Exception: {str(e)}")
        return False

def test_google_session_invalid():
    """Test POST /api/auth/google/session with invalid session_id"""
    print(f"\n{BLUE}Testing POST /api/auth/google/session (invalid session_id){RESET}")
    
    payload = {"session_id": "obviously_invalid_xyz_12345"}
    
    try:
        r = requests.post(f"{BASE_URL}/auth/google/session", json=payload, timeout=15)
        if r.status_code == 401:
            data = r.json()
            if "failed to verify google session" in data.get("detail", "").lower():
                log_test("Google session invalid ID", True, f"Correctly rejected: {data['detail']}")
                return True
            else:
                log_test("Google session invalid ID", False, f"Wrong error message: {data.get('detail')}")
                return False
        else:
            log_test("Google session invalid ID", False, f"Expected 401, got {r.status_code}: {r.text}")
            return False
    except Exception as e:
        log_test("Google session invalid ID", False, f"Exception: {str(e)}")
        return False

def test_google_session_empty():
    """Test POST /api/auth/google/session with empty session_id"""
    print(f"\n{BLUE}Testing POST /api/auth/google/session (empty session_id){RESET}")
    
    payload = {"session_id": ""}
    
    try:
        r = requests.post(f"{BASE_URL}/auth/google/session", json=payload, timeout=10)
        if r.status_code == 400:
            data = r.json()
            if "invalid session_id" in data.get("detail", "").lower():
                log_test("Google session empty ID", True, f"Correctly rejected: {data['detail']}")
                return True
            else:
                log_test("Google session empty ID", False, f"Wrong error message: {data.get('detail')}")
                return False
        else:
            log_test("Google session empty ID", False, f"Expected 400, got {r.status_code}: {r.text}")
            return False
    except Exception as e:
        log_test("Google session empty ID", False, f"Exception: {str(e)}")
        return False

def main():
    """Run all tests"""
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}FlyYaro Backend Auth Testing Suite{RESET}")
    print(f"{BLUE}Testing against: {BASE_URL}{RESET}")
    print(f"{BLUE}{'='*60}{RESET}")
    
    # Test existing endpoints first
    test_root_endpoint()
    test_status_endpoints()
    
    # Test registration flow
    new_user = test_register_valid()
    if new_user:
        test_register_duplicate(new_user["email"])
    
    test_register_invalid_email()
    test_register_short_password()
    
    # Test login flow
    login_result = test_login_valid()
    test_login_wrong_password()
    test_login_unknown_email()
    
    # Test /auth/me endpoint
    test_auth_me_without_cookie()
    
    if login_result:
        cookie = login_result["cookie"]
        test_auth_me_with_cookie(cookie)
        test_auth_me_with_bearer(cookie)
        
        # Test logout flow
        test_logout_with_cookie(cookie)
        test_auth_me_after_logout(cookie)
    
    test_logout_without_cookie()
    
    # Test Google session endpoint
    test_google_session_invalid()
    test_google_session_empty()
    
    # Print summary
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}Test Summary{RESET}")
    print(f"{BLUE}{'='*60}{RESET}")
    print(f"{GREEN}Passed: {test_results['passed']}{RESET}")
    print(f"{RED}Failed: {test_results['failed']}{RESET}")
    print(f"Total: {test_results['passed'] + test_results['failed']}")
    
    if test_results['failed'] > 0:
        print(f"\n{RED}Failed Tests:{RESET}")
        for test in test_results['tests']:
            if not test['passed']:
                print(f"  - {test['name']}: {test['details']}")
    
    print(f"\n{BLUE}{'='*60}{RESET}\n")
    
    # Exit with appropriate code
    sys.exit(0 if test_results['failed'] == 0 else 1)

if __name__ == "__main__":
    main()
