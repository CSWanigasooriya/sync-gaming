# Deployment Checklist

## Before You Deploy

- [ ] Code is committed to GitHub
- [ ] `.gitignore` includes `backend/serviceAccountKey.json`
- [ ] `.gitignore` includes `backend/.env`
- [ ] Firebase project created (`gen-lang-client-0350765152`)
- [ ] Firebase service account key downloaded

## Deploy Backend to Render

- [ ] Create Render account (https://render.com)
- [ ] Connect GitHub repository
- [ ] Create Web Service with:
  - Build Command: `cd backend && npm install`
  - Start Command: `cd backend && npm start`
- [ ] Add environment variables:
  - `NODE_ENV` = `production`
  - `PORT` = `10000`
  - `FIREBASE_DATABASE_URL` = (your Firebase URL)
  - `FIREBASE_SERVICE_ACCOUNT` = (your service account JSON)
- [ ] Wait for deployment (green status)
- [ ] Copy Render URL: `https://sync-gaming-backend.onrender.com`

## Deploy Frontend to Firebase Hosting

- [ ] Run: `npm run build`
- [ ] Install Firebase CLI: `npm install -g firebase-tools`
- [ ] Run: `firebase login`
- [ ] Run: `firebase init hosting`
- [ ] Update `src/.env.production`:
  ```
  REACT_APP_API_URL=https://sync-gaming-backend.onrender.com/api
  ```
- [ ] Run: `npm run build` again
- [ ] Run: `firebase deploy --only hosting`
- [ ] Copy Firebase URL from output

## After Deployment

- [ ] Test frontend at Firebase URL
- [ ] Test sign in
- [ ] Test promoting user to admin
- [ ] Check backend logs on Render
- [ ] Check frontend console for errors

## Important URLs

- **Frontend**: https://sync-gaming-5a4c.web.app (example)
- **Backend**: https://sync-gaming-backend.onrender.com (example)
- **Firebase Console**: https://console.firebase.google.com
- **Render Dashboard**: https://dashboard.render.com

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check Render logs, verify serviceAccountKey |
| CORS errors | Update `allowedOrigins` in server.js with Firebase URL |
| Frontend shows errors | Check `.env.production` API URL |
| Can't sign in | Check Firebase Auth configuration |

## Scale Up (If Needed)

- Render paid plans start at $7/month
- Firebase upgrades available when needed
- No vendor lock-in - can migrate anytime

**Notes**:
- First request to Render takes ~1 min (free tier limitation)
- Both services have generous free tiers
- Monitor usage in dashboards regularly
