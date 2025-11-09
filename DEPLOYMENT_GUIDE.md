# Deploy to Render + Firebase Hosting

## Overview
- **Frontend**: Deploy to Firebase Hosting (FREE)
- **Backend**: Deploy to Render (FREE tier)

## Prerequisites
- GitHub account (free)
- Render account (free)
- Firebase project already set up

## Step 1: Push Code to GitHub

### 1.1 Initialize Git (if not already done)
```bash
cd d:\Projects\sync-gaming
git init
```

### 1.2 Create `.gitignore`
Already done! Your project has:
- `backend/.gitignore` - Protects serviceAccountKey.json
- `.gitignore` (in root if exists)

### 1.3 Commit and Push
```bash
git add .
git commit -m "Initial commit - sync gaming platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sync-gaming.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## Step 2: Deploy Backend to Render

### 2.1 Create Render Account
1. Go to https://render.com
2. Sign up (you can use GitHub)
3. Create new account

### 2.2 Deploy Backend Service
1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account
4. Select your `sync-gaming` repository
5. Fill in these details:

   | Field | Value |
   |-------|-------|
   | Name | `sync-gaming-backend` |
   | Environment | `Node` |
   | Build Command | `cd backend && npm install` |
   | Start Command | `cd backend && npm start` |
   | Plan | `Free` |

6. Click **"Advanced"** and add Environment Variables:

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `PORT` | `10000` |
   | `FIREBASE_DATABASE_URL` | `https://gen-lang-client-0350765152.firebaseio.com` |
   | `FIREBASE_SERVICE_ACCOUNT` | (see below) |

### 2.3 Add Firebase Service Account

For the `FIREBASE_SERVICE_ACCOUNT` environment variable:

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click **"Generate New Private Key"**
3. Open the downloaded JSON file with a text editor
4. Copy the **entire JSON content** (as one line)
5. Paste into Render's `FIREBASE_SERVICE_ACCOUNT` field

**OR** Minify the JSON first:
```json
{"type":"service_account","project_id":"gen-lang-client-0350765152",...}
```

7. Click **"Create Web Service"**
8. Wait for deployment (2-3 minutes)
9. Note your Render URL: `https://sync-gaming-backend.onrender.com`

## Step 3: Deploy Frontend to Firebase Hosting

### 3.1 Build React App
```bash
npm run build
```

### 3.2 Initialize Firebase Hosting
```bash
firebase login
firebase init hosting
```

When prompted:
- Choose your Firebase project: `gen-lang-client-0350765152`
- Public directory: `build`
- Configure as single-page app: **Yes**

### 3.3 Update Frontend API URL

Create/update `src/.env.production`:
```
REACT_APP_API_URL=https://sync-gaming-backend.onrender.com/api
```

Then rebuild:
```bash
npm run build
```

### 3.4 Deploy to Firebase
```bash
firebase deploy --only hosting
```

You'll get a URL like: `https://sync-gaming-5a4c.web.app`

## Step 4: Update CORS Settings

Update `backend/server.js` line with your Firebase Hosting URL:

```javascript
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? ['https://YOUR-FIREBASE-URL.web.app']
  : ['http://localhost:3000'];
```

Then push to GitHub:
```bash
git add .
git commit -m "Update CORS for production"
git push
```

Render will auto-redeploy!

## Step 5: Test Everything

1. Go to your Firebase Hosting URL
2. Try signing in
3. Try promoting a user to admin
4. Check the backend logs on Render dashboard

## Architecture

```
User Browser
    ↓
Firebase Hosting (Frontend)
    ↓
Render Backend API
    ↓
Firebase (Auth + Firestore + Storage)
```

## Troubleshooting

### Backend not starting
- Check Render dashboard logs
- Verify `FIREBASE_SERVICE_ACCOUNT` is valid JSON
- Check if `serviceAccountKey.json` is in `.gitignore`

### CORS errors
- Update `allowedOrigins` with your exact Firebase URL
- Redeploy backend

### Frontend can't reach backend
- Verify `REACT_APP_API_URL` environment variable
- Check if Render backend is online
- Check browser network tab for actual request URL

### Service Account Key Error
- Make sure to paste the ENTIRE JSON (no line breaks)
- Don't use quotes around the JSON
- Check that all brackets are balanced

## Cost

| Service | Free Tier |
|---------|-----------|
| Firebase Hosting | 1GB storage, 10GB/month transfer |
| Render Backend | 750 hrs/month (always-on is paid) |
| Firebase Auth/Firestore | Generous free tier |

**Note**: Render free tier services spin down after 15 min inactivity. First request takes ~1 min. Upgrade to Paid plan for instant response.

## Next Steps

1. Monitor Render and Firebase dashboards
2. Set up error logging/monitoring
3. Add custom domain (optional)
4. Scale as needed

For more help, see:
- `BACKEND_SETUP.md` - Backend configuration
- `ADMIN_GUIDE.md` - Admin operations
- `README.md` - Project overview
