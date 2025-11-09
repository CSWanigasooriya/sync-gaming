# SyncGaming Backend Setup Guide

## Overview
This backend handles custom Firebase claims for admin users. It allows you to:
- Set/remove admin privileges for users
- Verify admin claims via custom JWT tokens
- Maintain an audit log of all admin changes

## Prerequisites
- Node.js installed
- Firebase project set up
- Service Account Key from Firebase Console

## Installation

1. **Download Service Account Key**
   - Go to Firebase Console → Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save as `serviceAccountKey.json` in the backend folder

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Add your Firebase database URL
   - (Optional) Add FIREBASE_SERVICE_ACCOUNT as JSON string

   ```
   PORT=5000
   FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
   FRONTEND_URL=http://localhost:3000
   ```

## Running the Backend

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

Server runs on `http://localhost:5000`

## API Endpoints

### Public Endpoints

**Health Check**
```
GET /api/health
```

### Authentication Endpoints

**Get Current User Info**
```
GET /api/auth/me
Authorization: Bearer {idToken}

Response:
{
  "uid": "user-id",
  "email": "user@example.com",
  "isAdmin": true,
  "customClaims": { "admin": true }
}
```

### Admin Endpoints
All admin endpoints require:
1. Valid Firebase ID Token
2. Admin custom claim to be set to `true`

**Set User as Admin**
```
POST /api/admin/set-admin
Authorization: Bearer {idToken}
Content-Type: application/json

Body:
{
  "email": "user@example.com"
  // OR
  "uid": "user-id"
}

Response:
{
  "message": "User is now an admin",
  "user": {
    "uid": "...",
    "email": "user@example.com",
    "isAdmin": true
  }
}
```

**Remove Admin Privileges**
```
POST /api/admin/remove-admin
Authorization: Bearer {idToken}
Content-Type: application/json

Body:
{
  "email": "user@example.com"
  // OR
  "uid": "user-id"
}
```

**List All Admins**
```
GET /api/admin/list-admins
Authorization: Bearer {idToken}

Response:
{
  "admins": [
    {
      "uid": "...",
      "email": "admin@example.com",
      "displayName": "Admin Name",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "count": 1
}
```

**Get Audit Logs**
```
GET /api/admin/audit-logs
Authorization: Bearer {idToken}

Response:
{
  "logs": [
    {
      "id": "...",
      "action": "SET_ADMIN",
      "targetUser": "user@example.com",
      "targetUid": "...",
      "performedBy": "admin@example.com",
      "timestamp": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## Frontend Integration

### 1. Set API URL in `.env`
In your React app's `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### 2. Check Admin Status
```javascript
const [user, setUser] = useState(null);

useEffect(() => {
  onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      const claims = (await currentUser.getIdTokenResult()).claims;
      const isAdmin = claims.admin === true;
      
      if (isAdmin) {
        navigate('/admin');
      }
    }
  });
}, []);
```

### 3. Get User Token for API Calls
```javascript
const token = await user.getIdToken();

fetch('/api/admin/set-admin', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ email: userEmail })
});
```

## Firestore Collections

### admin-audit-logs
Stores all admin actions for audit trail:
```
{
  action: "SET_ADMIN" | "REMOVE_ADMIN",
  targetUser: "user@example.com",
  targetUid: "firebase-uid",
  performedBy: "admin@example.com",
  timestamp: Timestamp
}
```

## Security Notes

1. **Service Account Key**: Keep `serviceAccountKey.json` secret! Add to `.gitignore`
2. **Token Expiration**: Firebase tokens expire in 1 hour. Frontend handles token refresh automatically
3. **CORS**: Configure CORS in `server.js` for your frontend URL
4. **Rate Limiting**: Consider adding rate limiting for production

## Troubleshooting

### "Firebase Admin SDK not initialized"
- Ensure `serviceAccountKey.json` exists in backend folder
- Check firebase configuration in `server.js`

### "Admin access required"
- Verify user has admin custom claim set
- Token might be expired, refresh with `getIdToken(true)`

### CORS Errors
- Update `cors()` in server.js with your frontend URL
- Frontend must send Authorization header with token

## Next Steps

1. Run the backend server
2. Set first admin user manually using Firebase Console
3. Test with the Admin Dashboard
4. Other admins can now promote users via the dashboard

For more info, see `ADMIN_GUIDE.md` in the root folder.
