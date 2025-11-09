# Railway + Netlify Deployment Checklist

## Before You Start

- [ ] Code pushed to GitHub
- [ ] Git username/email configured
- [ ] `.gitignore` includes `backend/serviceAccountKey.json`
- [ ] Firebase service account key downloaded

## Backend Deployment (Railway)

### Setup Railway
- [ ] Create Railway account (no card needed)
- [ ] Connect GitHub
- [ ] Create new project
- [ ] Select `sync-gaming` repo
- [ ] Deploy backend folder

### Configure Environment Variables on Railway
- [ ] `NODE_ENV` = `production`
- [ ] `FIREBASE_DATABASE_URL` = `https://gen-lang-client-0350765152.firebaseio.com`
- [ ] `FIREBASE_SERVICE_ACCOUNT` = (your service account JSON)

### Get Backend URL
- [ ] Copy Railway public URL
- [ ] Format: `https://your-service.up.railway.app`
- [ ] Verify backend is running (visit URL in browser)

## Frontend Deployment (Netlify)

### Update Frontend Config
- [ ] Create `src/.env.production`
- [ ] Add `REACT_APP_API_URL=YOUR_RAILWAY_URL/api`
- [ ] Replace with actual Railway URL

### Build Frontend
```bash
npm run build
```
- [ ] Build completes without errors
- [ ] `build` folder is created

### Deploy to Netlify
- [ ] Create Netlify account (no card needed)
- [ ] Install Netlify CLI: `npm install -g netlify-cli`
- [ ] Run: `netlify login`
- [ ] Run: `netlify deploy --prod --dir=build`
- [ ] Get Netlify URL

## Update Backend CORS

- [ ] Update `backend/server.js` with Netlify URL:
```javascript
const allowedOrigins = ['https://your-site.netlify.app']
```
- [ ] Commit and push to GitHub
- [ ] Railway auto-redeploys

## Test Everything

- [ ] Open Netlify URL in browser
- [ ] Page loads without errors
- [ ] Try signing in
- [ ] Try creating account
- [ ] Try promoting user to admin
- [ ] Check browser console (F12) for errors
- [ ] Check Railway logs if issues occur

## Important URLs

| Service | URL |
|---------|-----|
| **Railway Dashboard** | https://railway.app |
| **Netlify Dashboard** | https://app.netlify.com |
| **Firebase Console** | https://console.firebase.google.com |
| **Your Frontend** | https://your-site.netlify.app |
| **Your Backend** | https://your-service.up.railway.app |
| **GitHub Repo** | https://github.com/CSWanigasooriya/sync-gaming |

## Troubleshooting Quick Fixes

| Problem | Fix |
|---------|-----|
| Backend 502 error | Check Railway logs for Firebase issues |
| CORS error | Update allowedOrigins in server.js + push to GitHub |
| Frontend blank | Check `.env.production` has correct API URL |
| Can't sign in | Check Firebase Auth, verify user exists |
| Netlify shows old version | Run `netlify deploy --prod --dir=build` |

## After Deployment

- [ ] Share your Netlify URL with friends
- [ ] Monitor Railway dashboard weekly
- [ ] Monitor Netlify deploy logs
- [ ] Keep Firebase console tab open for debugging
- [ ] Test admin features thoroughly

## Optional: Setup Custom Domain

- Railway: Add custom domain in settings ($3-7/year from registrar)
- Netlify: Free subdomain included, or add custom domain

## Cost Breakdown

| Service | Cost |
|---------|------|
| Railway | FREE ($5 credit included) |
| Netlify | FREE (generous tier) |
| Firebase | FREE (generous tier) |
| **Total** | **$0** |

## Need to Scale Later?

- Railway: Upgrade to paid plans ($5+/month)
- Netlify: Upgrade only for extra bandwidth
- Firebase: Pay only for usage beyond free tier

---

**Status**: Ready to deploy! Follow `RAILWAY_NETLIFY_DEPLOY.md` for detailed steps.
