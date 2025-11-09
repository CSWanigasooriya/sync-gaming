# Integration Guide: Adding Subscription Model to Your App

## Step-by-Step Integration

### STEP 1: Update App.js with SubscriptionProvider

In `src/App.js`, wrap your Router with SubscriptionProvider:

```javascript
import { SubscriptionProvider } from './context/SubscriptionContext';

// ... existing imports ...

function App() {
  return (
    <SubscriptionProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLanding />} />
          <Route path="/auth" element={<Auth />} />
          {/* ... rest of routes ... */}
        </Routes>
      </Router>
    </SubscriptionProvider>
  );
}

export default App;
```

---

### STEP 2: Add AdBanner to Landing Page

In `src/App.js`, update the `MainLanding` function to include AdBanner:

**Before:**
```javascript
{/* Footer */}
<footer className="py-8 text-center text-gray-400 text-sm bg-black">
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
  >
    &copy; {new Date().getFullYear()} SyncGaming. All rights reserved.
  </motion.div>
</footer>
```

**After:**
```javascript
import AdBanner from './components/AdBanner';

// ... in your MainLanding component ...

{/* Ad Banner Before Footer */}
<AdBanner position="bottom" adType="banner" />

{/* Footer */}
<footer className="py-8 text-center text-gray-400 text-sm bg-black">
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
  >
    &copy; {new Date().getFullYear()} SyncGaming. All rights reserved.
  </motion.div>
</footer>
```

---

### STEP 3: Update Backend server.js

In `backend/server.js`, add the subscription routes after other route definitions:

```javascript
// After other route definitions (around line 150)

// ============ SUBSCRIPTION & AD ROUTES ============
const subscriptionRoutes = require('./routes/subscription');
app.use(subscriptionRoutes);

// Error handling (keep at bottom)
app.use((err, req, res, next) => {
  // ... error handling ...
});
```

---

### STEP 4: Create .env Files

#### Frontend .env (in root directory `d:\Projects\sync-gaming\.env`)
```bash
# Google AdSense (get these from your AdSense account after approval)
REACT_APP_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
REACT_APP_ADSENSE_SLOT_BANNER=xxxxxxxxxx
REACT_APP_ADSENSE_SLOT_INTERSTITIAL=xxxxxxxxxx

# Firebase (already configured, but can add here)
REACT_APP_FIREBASE_API_KEY=AIzaSyDOpen0yRQdCevEDoWFUph7Hc1zuDawsrc

# Feature Flags
REACT_APP_ADS_ENABLED=true
REACT_APP_COSMETICS_ENABLED=false
REACT_APP_TOURNAMENTS_ENABLED=true

# Environment
REACT_APP_ENV=development
```

#### Backend .env (in `backend/.env`)
```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Firebase
FIREBASE_DATABASE_URL=https://gen-lang-client-0350765152.firebaseio.com
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}

# Ad Configuration
AD_ANALYTICS_ENABLED=true
AD_REWARD_POINTS=10
```

---

### STEP 5: Update public/index.html

In `public/index.html`, add Google AdSense script in the `<head>` section:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Play WebGL Games Instantly" />
    
    <!-- Google AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx"
         crossorigin="anonymous"></script>
    
    <title>SyncGaming - Play WebGL Games Instantly</title>
  </head>
  <body>
    <!-- ... rest of HTML ... -->
  </body>
</html>
```

Replace `ca-pub-xxxxxxxxxxxxxxxx` with your actual AdSense Publisher ID.

---

### STEP 6: Create Firestore Collection (Manual Setup)

Go to [Firebase Console](https://console.firebase.google.com) → Firestore → Create Collection:

**Collection: `gameSettings`**
**Document: `config`**

Add these fields:
```javascript
{
  adConfig: {
    enabled: true,
    frequency: "low",
    maxAdsPerDay: 10,
    minTimeBetweenAds: 15,
    testMode: true
  },
  
  featureFlags: {
    subscriptionEnabled: false,
    cosmetics: false,
    tournaments: true,
    socialFeatures: true,
    achievements: true,
    leaderboards: true
  }
}
```

---

### STEP 7: Test Locally

```bash
# Terminal 1 - Start Frontend
npm start

# Terminal 2 - Start Backend
cd backend && npm run dev

# Frontend should run on http://localhost:3000
# Backend should run on http://localhost:5000
```

**Check if working:**
1. Homepage loads with ad placeholder at bottom ✓
2. Console shows no errors ✓
3. Backend server running ✓
4. Can sign up/sign in ✓

---

### STEP 8: Test Ad Tracking (Optional)

Call the ad tracking endpoint manually to verify it works:

```javascript
// In browser console
const token = await firebase.auth().currentUser.getIdTokenResult();
const response = await fetch('http://localhost:5000/api/ads/track-view', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token.token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    gameId: 'test-game',
    adType: 'banner',
    duration: 5
  })
});
console.log(await response.json());
```

---

### STEP 9: Register with Google AdSense

1. Go to [Google AdSense](https://www.google.com/adsense)
2. Click "Get Started"
3. Sign in with your Google Account
4. Enter your domain (e.g., `syncgaming.com`)
5. Follow verification steps
6. Wait for approval (1-7 days)
7. Get your Publisher ID and Slot IDs
8. Update your `.env` and `public/index.html`

---

### STEP 10: Deploy to Production

#### Deploy Frontend (Netlify)
```bash
npm run build
# Deploy build/ folder to Netlify
```

#### Deploy Backend (Render or Railway)
```bash
cd backend
git push render main  # or railway
```

**Don't forget:**
- Update `.env` in production
- Update `public/index.html` with real AdSense ID
- Test ads are loading
- Check browser console for errors

---

## Complete Integration Checklist

- [ ] Installed SubscriptionContext in App.js
- [ ] Added AdBanner to landing page
- [ ] Updated backend server.js with subscription routes
- [ ] Created `.env` files with placeholders
- [ ] Added AdSense script to index.html
- [ ] Created Firestore `gameSettings` collection
- [ ] Tested locally (frontend + backend running)
- [ ] Tested ad tracking endpoint
- [ ] Registered domain with Google AdSense
- [ ] Updated `.env` with real AdSense IDs (after approval)
- [ ] Deployed frontend to production
- [ ] Deployed backend to production
- [ ] Verified ads showing in production

---

## Common Issues & Solutions

### Issue: Ads not showing in production
**Solution:** 
- Verify AdSense approval status
- Check if Publisher ID in HTML matches .env
- Clear browser cache
- Check if AdSense script loading (Network tab)
- Ensure HTTPS (AdSense requires it)

### Issue: SubscriptionContext undefined
**Solution:**
- Ensure SubscriptionProvider wraps Router in App.js
- Check import path is correct
- Verify file exists: `src/context/SubscriptionContext.js`

### Issue: Ad tracking 404 error
**Solution:**
- Verify backend routes imported in server.js
- Check backend is running on port 5000
- Verify endpoint path: `/api/ads/track-view`
- Check token is valid (auth)

### Issue: Firestore permission denied
**Solution:**
- Check security rules in Firestore Console
- Verify user is authenticated
- Check collection name matches (`adAnalytics`)

---

## Sample Component Usage

Once integrated, you can use subscription context in any component:

```javascript
import { useSubscription } from '../context/SubscriptionContext';

function MyComponent() {
  const { subscription, loading, user } = useSubscription();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      <p>Tier: {subscription.tier}</p>
      <p>Ad-Free: {subscription.features.adFree ? '✓' : 'Limited'}</p>
      <p>Achievements: {subscription.rewards.achievements.length}</p>
    </div>
  );
}
```

---

## Next Phase Features (Optional)

After basic integration works:

### Add Achievements Display
```javascript
// Component: AchievementsBadges.js
// Shows earned achievements on profile
```

### Add Cosmetics Store
```javascript
// Component: CosmeticsStore.js
// Shows cosmetics user can purchase
```

### Add Leaderboard Enhancements
```javascript
// Update: LeaderboardModal.js
// Add subscription tier badges to leaderboard
```

### Add Admin Dashboard Tab
```javascript
// Component: AdminMonetization.js
// Shows ad revenue, user metrics, etc.
```

---

## Performance Tips

1. **Lazy load AdBanner**: Use React.lazy() for ad component
2. **Defer AdSense script**: Use `async` attribute
3. **Cache subscription context**: Avoid re-fetching from Firestore
4. **Optimize Firestore queries**: Index commonly searched fields
5. **Monitor backend performance**: Track API response times

---

## Security Tips

1. Always verify token in backend endpoints
2. Validate all user input
3. Use HTTPS in production (required for ads)
4. Store sensitive keys in .env only
5. Review Firestore security rules regularly
6. Monitor for abuse in analytics

---

## Monitoring After Launch

1. Check Google AdSense dashboard daily (first week)
2. Monitor Firestore quota usage
3. Track backend API performance
4. Review user feedback
5. Analyze ad performance metrics
6. Check for any error logs

---

## Quick Deployment Commands

```bash
# Build frontend
npm run build

# Build and run backend locally
cd backend
npm run dev

# Deploy to production
git add .
git commit -m "Add subscription model"
git push origin main

# Check backend logs (if using Render/Railway)
# Visit provider dashboard for logs
```

---

## Resources

- [Firebase Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Google AdSense Setup](https://support.google.com/adsense)
- [React Context API](https://react.dev/reference/react/useContext)
- [Express.js Guide](https://expressjs.com/)

---

## Support & Questions

If you encounter issues:
1. Check the troubleshooting section above
2. Review your specific config file
3. Check Firebase Console for errors
4. Check browser console for errors
5. Check backend logs

---

**You're all set! Follow these steps and your subscription model will be integrated within 4-5 hours.** 🚀
