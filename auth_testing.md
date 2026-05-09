# Auth Testing Playbook (Emergent Google Auth + Email/Password)

## Quick Reference
- Google Auth flow: User clicks "Continue with Google" → redirected to `https://auth.emergentagent.com/?redirect=...` → returns to app with `#session_id=...` in URL fragment → AuthCallback exchanges for `session_token` cookie → user is logged in.
- Email/password: `/api/auth/register` and `/api/auth/login` issue the same `session_token` cookie (httpOnly, secure, samesite=none, 7-day expiry).
- Logout: `/api/auth/logout` deletes the session row in MongoDB and clears the cookie.

## Step 1: Create Test User & Session (mongosh)
```
mongosh --eval "
use('test_database');
var userId = 'test-user-' + Date.now();
var sessionToken = 'test_session_' + Date.now();
db.users.insertOne({
  user_id: userId,
  email: 'test.user.' + Date.now() + '@example.com',
  name: 'Test User',
  picture: 'https://via.placeholder.com/150',
  provider: 'google',
  password_hash: null,
  created_at: new Date()
});
db.user_sessions.insertOne({
  user_id: userId,
  session_token: sessionToken,
  expires_at: new Date(Date.now() + 7*24*60*60*1000),
  created_at: new Date()
});
print('Session token: ' + sessionToken);
print('User ID: ' + userId);
"
```

## Step 2: Backend API Tests

### Google Auth Session Exchange (mocked - real one needs valid Emergent session_id)
```
curl -X POST "$BACKEND/api/auth/google/session" \
  -H "Content-Type: application/json" \
  -d '{"session_id": "test_xxx"}'
```

### Email/Password Register
```
curl -X POST "$BACKEND/api/auth/register" \
  -H "Content-Type: application/json" \
  -c /tmp/cookies.txt \
  -d '{"name":"John","email":"john@test.com","password":"Pass1234!"}'
```

### Email/Password Login
```
curl -X POST "$BACKEND/api/auth/login" \
  -H "Content-Type: application/json" \
  -c /tmp/cookies.txt \
  -d '{"email":"john@test.com","password":"Pass1234!"}'
```

### Get current user
```
curl "$BACKEND/api/auth/me" -b /tmp/cookies.txt
```
Or with bearer:
```
curl "$BACKEND/api/auth/me" -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

### Logout
```
curl -X POST "$BACKEND/api/auth/logout" -b /tmp/cookies.txt -c /tmp/cookies.txt
```

## Step 3: Frontend Browser Test
- Visit `/login`, click "Continue with Google" → redirected to Emergent
- After Google completes, lands on `/dashboard#session_id=...`
- Frontend `AuthCallback` exchanges, sets cookie, redirects to `/`
- Header shows logged-in user name

## Checklist
- [ ] User document has `user_id` field (UUID), no MongoDB `_id` exposed
- [ ] Session `user_id` matches user `user_id`
- [ ] All queries use `{"_id": 0}` projection
- [ ] `/api/auth/me` returns 401 if cookie missing
- [ ] `/api/auth/me` returns user when session valid
- [ ] Cookie has httpOnly=True, secure=True, samesite=none, path="/"
- [ ] Email/password rejected with 401 on wrong password
- [ ] Email/password rejected with 400 on duplicate email at register

## Test Identities
Stored in `/app/memory/test_credentials.md` after seed.
