# Deploy to Railway + Netlify (Free, No Card Required)

## Overview
- **Frontend**: Netlify (FREE tier - generous)
- **Backend**: Railway (FREE $5 credit/month)
- **Database**: Firebase (FREE tier)

**Total Cost: $0** ✅

## Prerequisites
- GitHub account (free)
- Railway account (free, no card)
- Netlify account (free, no card)
- Firebase project already set up

## Part 1: Deploy Backend to Railway

### 1.1 Create Railway Account
1. Go to https://railway.app
2. Click **"Start Project"**
3. Click **"GitHub"** to sign up with GitHub
4. Authorize Railway to access your GitHub
5. Done! You're logged in (no card needed)

### 1.2 Deploy Backend
1. In Railway dashboard, click **"New Project"**
2. Click **"Deploy from GitHub"**
3. Select your `sync-gaming` repository
4. Click **"Deploy"**
5. Railway will ask which folder to deploy - select **`backend`**
6. Wait for deployment (2-3 minutes)

### 1.3 Add Environment Variables
1. In Railway dashboard, go to **"Variables"** tab
2. Add these variables:

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `FIREBASE_DATABASE_URL` | `https://gen-lang-client-0350765152.firebaseio.com` |
   | `FIREBASE_SERVICE_ACCOUNT` | (see Step 1.4) |

### 1.4 Add Firebase Service Account
**IMPORTANT**: Get your service account key JSON:

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click **"Generate New Private Key"**
3. Open the downloaded JSON file
4. Copy the **entire content** as one line
5. Paste into Railway's `FIREBASE_SERVICE_ACCOUNT` variable

**Example** (minified):
```
{"type":"service_account","project_id":"gen-lang-client-0350765152",...all the rest...}
```

6. Click **"Save"**
7. Railway will redeploy automatically

### 1.5 Get Your Backend URL
1. Go to Railway **"Settings"** tab
2. Look for **"Railway Domain"** or **"Public URL"**
3. Copy it (should look like: `https://sync-gaming-backend-prod.up.railway.app`)
4. Save this - you'll need it for the frontend!

## Part 2: Deploy Frontend to Netlify

### 2.1 Create Netlify Account
1. Go to https://netlify.com
2. Click **"Sign Up"**
3. Click **"GitHub"** to sign up with GitHub
4. Authorize Netlify to access your GitHub
5. Done! No card needed

### 2.2 Update Frontend Environment Variables

Create `src/.env.production`:
```
REACT_APP_API_URL=https://YOUR-RAILWAY-URL/api
```

**Replace** `YOUR-RAILWAY-URL` with your actual Railway backend URL from Step 1.5

Example:
```
REACT_APP_API_URL=https://sync-gaming-backend-prod.up.railway.app/api
```

### 2.3 Build Frontend
```bash
npm run build
```

### 2.4 Deploy to Netlify
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=build
```

When prompted:
- **Team**: Choose your team
- **Site**: Create new site
- **Deploy folder**: `build`

**Done!** You'll get a URL like: `https://your-sync-gaming.netlify.app`

## Part 3: Update Backend CORS

Update `backend/server.js` with your Netlify URL:

```javascript
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? ['https://your-sync-gaming.netlify.app']
  : ['http://localhost:3000'];
```

Then push to GitHub:
```bash
git add .
git commit -m "Update CORS for Netlify URL"
git push
```

Railway will auto-redeploy!

## Testing Your Deployment

1. Go to your Netlify URL: `https://your-sync-gaming.netlify.app`
2. Try signing in
3. Try promoting a user to admin
4. Check for console errors (F12)
5. Check Railway logs if backend errors occur

## Architecture

```
User Browser
    ↓
Netlify (Frontend - React)
    ↓
Railway (Backend - Express API)
    ↓
Firebase (Auth + Firestore + Storage)
```

## Free Tier Limits

| Service | Free Tier | Limit |
|---------|-----------|-------|
| Netlify Frontend | Unlimited | 100GB/month bandwidth |
| Railway Backend | $5 credit/month | ~10,000 requests |
| Firebase | Generous | 1GB storage, 50k reads/day |

**Note**: Railway's free $5 credit is usually enough for 1-2 small projects

## Troubleshooting

### Backend not working
- Check Railway logs: Dashboard → "Logs" tab
- Verify `FIREBASE_SERVICE_ACCOUNT` is valid JSON (no line breaks)
- Check if Firebase service account has correct permissions

### CORS errors
- Verify `allowedOrigins` in `backend/server.js` matches your Netlify URL
- Push to GitHub and wait for Railway to redeploy
- Check if trailing slash is correct (no `/api` in origin)

### Frontend shows blank page
- Check browser console (F12)
- Verify `REACT_APP_API_URL` in `.env.production`
- Rebuild and redeploy: `npm run build` then `netlify deploy --prod --dir=build`

### Can't sign in
- Check Firebase Auth configuration
- Check if user exists in Firebase console
- Check browser network tab for actual errors

## Useful Commands

```bash
# Check Netlify deploy status
netlify status

# View Netlify logs
netlify logs

# Redeploy to Netlify
netlify deploy --prod --dir=build

# Check Railway logs (via web interface)
# Dashboard → Project → Logs tab
```

## Next Steps

1. Monitor Railway and Netlify dashboards
2. Test all features thoroughly
3. Invite friends to test
4. If you get popular, consider upgrading (both have paid plans)

## Important Files

- `src/.env.production` - Frontend production config
- `backend/server.js` - Backend production config
- `render.yaml` - Now can be deleted (using Railway instead)

## Need Help?

- Railway docs: https://docs.railway.app
- Netlify docs: https://docs.netlify.com
- Firebase docs: https://firebase.google.com/docs

Everything is free, no credit card needed, and you can upgrade later if needed! 🚀
