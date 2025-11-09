# Backend Setup Instructions

## Step 1: Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **gen-lang-client-0350765152**
3. Click ⚙️ (Settings) → **Project Settings**
4. Go to the **Service Accounts** tab
5. Click **Generate New Private Key**
6. A JSON file will download automatically

## Step 2: Place Service Account Key

1. Save the downloaded JSON file
2. Name it `serviceAccountKey.json`
3. Place it in: `d:\Projects\sync-gaming\backend\`
4. **Important**: This file is secret! It's already in `.gitignore`

## Step 3: Create .env File

1. Copy the contents of `backend/.env.example`
2. Create a new file: `backend/.env`
3. Paste and fill in:
   ```
   PORT=5000
   FIREBASE_DATABASE_URL=https://gen-lang-client-0350765152.firebaseio.com
   FRONTEND_URL=http://localhost:3000
   ```

## Step 4: Start the Backend

Open a new terminal and run:

```bash
cd d:\Projects\sync-gaming\backend
npm install
npm run dev
```

You should see:
```
Backend server running on port 5000
API endpoints available at http://localhost:5000/api
```

## Step 5: Update Frontend .env

In `d:\Projects\sync-gaming\.env` (create if not exists):
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Step 6: Set First Admin User

Since no one is admin yet, you need to set the first admin manually using Firebase Console:

1. Go to Firebase Console → Authentication
2. Find the user you want to make admin
3. Click the three dots → **Edit User**
4. Scroll to **Custom Claims**
5. Add: `{ "admin": true }`
6. Click **Save**

The user will now see the Admin Dashboard when they log in!

## Step 7: Test

1. Restart the React app (`npm start` in main folder)
2. Log in with the admin user
3. You should be redirected to `/admin`
4. Click the **👨‍💼 Admin Management** tab
5. Try promoting another user to admin!

## How It Works

```
User Login
  ↓
Frontend gets ID Token
  ↓
Check custom claims (admin: true?)
  ↓
If admin → Show /admin dashboard
If not → Show /home
```

## Troubleshooting

### Backend won't start
- Check if `serviceAccountKey.json` exists
- Check if port 5000 is not in use
- Make sure all npm dependencies are installed

### CORS Error
- Backend must be running on `http://localhost:5000`
- Check `REACT_APP_API_URL` in frontend `.env`

### Admin can't see dashboard
- Make sure custom claim is set to `{ "admin": true }`
- Try logging out and logging back in
- Check browser console for errors

## Files Created/Modified

Backend:
- `/backend/server.js` - Main API server
- `/backend/package.json` - Dependencies
- `/backend/.env` - Configuration (create yourself)
- `/backend/serviceAccountKey.json` - Firebase key (download yourself)

Frontend:
- `/src/pages/AdminDashboard.js` - Admin interface
- `/src/components/AdminManagement.js` - Admin management UI
- `/src/App.js` - Added `/admin` route

## Next Steps

Once everything is working:
1. First admin can promote other users
2. Build out more admin features
3. Deploy backend (e.g., to Firebase Functions, Heroku, etc.)
