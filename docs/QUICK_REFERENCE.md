# Quick Reference Guide

## 📁 Files Created

| File | Purpose | Status |
|------|---------|--------|
| `src/context/SubscriptionContext.js` | Manage subscription state | ✅ Ready |
| `src/components/AdBanner.js` | Display ads | ✅ Ready |
| `src/components/AdBanner.css` | Ad styling | ✅ Ready |
| `backend/routes/subscription.js` | Backend endpoints | ✅ Ready |
| `docs/SUBSCRIPTION_MODEL_DESIGN.md` | Full strategy | ✅ Ready |
| `docs/SUBSCRIPTION_IMPLEMENTATION_CHECKLIST.md` | Week-by-week tasks | ✅ Ready |
| `docs/CONFIGURATION_GUIDE.md` | Setup reference | ✅ Ready |
| `SUBSCRIPTION_SUMMARY.md` | Executive summary | ✅ Ready |
| `INTEGRATION_GUIDE.md` | Step-by-step integration | ✅ Ready |
| `ARCHITECTURE.md` | System design & diagrams | ✅ Ready |

---

## 🚀 Getting Started (First 2 Hours)

### Task 1: Review Documentation (30 min)
1. Read `SUBSCRIPTION_SUMMARY.md` (5 min)
2. Skim `SUBSCRIPTION_MODEL_DESIGN.md` (15 min)
3. Review `ARCHITECTURE.md` diagrams (10 min)

### Task 2: Setup (45 min)
1. Create `.env` file in root (5 min)
2. Create `.env` file in `backend/` (5 min)
3. Add SubscriptionProvider to `App.js` (10 min)
4. Add AdBanner to landing page (10 min)
5. Update `backend/server.js` with routes (10 min)
6. Create Firestore collection (5 min)

### Task 3: Test (45 min)
1. Run frontend: `npm start` (5 min)
2. Run backend: `cd backend && npm run dev` (5 min)
3. Test signup flow (10 min)
4. Test ad placeholder (10 min)
5. Check browser console for errors (10 min)
6. Verify Firestore data (5 min)

**Total: ~2 hours ✓**

---

## 📋 Integration Checklist

```bash
# Quick checklist for setup
□ Read INTEGRATION_GUIDE.md
□ Create .env files
□ Update App.js with SubscriptionProvider
□ Add AdBanner to MainLanding
□ Update backend/server.js with subscription routes
□ Create Firestore gameSettings collection
□ Test locally (frontend + backend)
□ Register domain with Google AdSense
□ Update public/index.html with AdSense script
□ Deploy frontend
□ Deploy backend
□ Monitor in production
```

---

## 🔑 Key Code Snippets

### 1. Wrap App with SubscriptionProvider
```javascript
// src/App.js
import { SubscriptionProvider } from './context/SubscriptionContext';

function App() {
  return (
    <SubscriptionProvider>
      <Router>{/* routes */}</Router>
    </SubscriptionProvider>
  );
}
```

### 2. Use Subscription in Any Component
```javascript
import { useSubscription } from '../context/SubscriptionContext';

function MyComponent() {
  const { subscription, loading } = useSubscription();
  
  if (loading) return <div>Loading...</div>;
  
  return <div>Tier: {subscription.tier}</div>;
}
```

### 3. Add AdBanner to Page
```javascript
import AdBanner from './components/AdBanner';

export default function MainLanding() {
  return (
    <div>
      {/* content */}
      <AdBanner position="bottom" adType="banner" />
    </div>
  );
}
```

### 4. Track Ad View (Frontend)
```javascript
const response = await fetch('/api/ads/track-view', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    gameId: 'snake-game',
    adType: 'banner',
    duration: 5
  })
});
```

### 5. Add Routes to Backend
```javascript
// backend/server.js
const subscriptionRoutes = require('./routes/subscription');
app.use(subscriptionRoutes);
```

---

## 🛠️ Environment Variables

### Frontend `.env`
```bash
REACT_APP_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
REACT_APP_ADSENSE_SLOT_BANNER=xxxxxxxxxx
REACT_APP_ADS_ENABLED=true
REACT_APP_ENV=development
```

### Backend `.env`
```bash
PORT=5000
NODE_ENV=development
AD_ANALYTICS_ENABLED=true
AD_REWARD_POINTS=10
```

---

## 🔄 API Endpoints

### GET Subscription
```bash
GET /api/subscription/user/:userId
Authorization: Bearer {token}

Response:
{
  "tier": "free",
  "joinedAt": "2024-11-09T...",
  "features": {
    "unlimitedPlay": true,
    "adFree": false,
    ...
  }
}
```

### POST Track Ad
```bash
POST /api/ads/track-view
Authorization: Bearer {token}
Content-Type: application/json

{
  "gameId": "snake-game",
  "adType": "banner",
  "duration": 5
}

Response:
{ "success": true }
```

### POST Claim Reward
```bash
POST /api/rewards/claim-ad-reward
Authorization: Bearer {token}

{
  "adType": "rewarded_video",
  "points": 10
}

Response:
{ "success": true, "points": 10 }
```

---

## 📊 Firestore Collections

### Required Collections
```
✓ users (update existing)
✓ adAnalytics (create new)
✓ gameSettings (create new)
✓ userAnalytics (update existing)

Already exist:
- leaderboard
- games
- userAnalytics
```

### Sample Data Structure
```javascript
// Firestore: users/{uid}
{
  subscription: {
    tier: "free",
    features: {
      unlimitedPlay: true,
      adFree: false
    },
    rewards: {
      points: 0
    }
  }
}

// Firestore: adAnalytics
{
  userId: "...",
  gameId: "snake-game",
  adType: "banner",
  timestamp: Timestamp.now()
}
```

---

## ✅ Testing Checklist

### Functional Tests
- [ ] User can sign up
- [ ] User gets "free" tier assigned
- [ ] Ad placeholder shows on landing page
- [ ] Ad tracking endpoint works
- [ ] Reward claiming works
- [ ] Subscription data in Firestore
- [ ] Leaderboard loads

### Integration Tests
- [ ] Frontend connects to backend
- [ ] Authentication works
- [ ] Firestore reads/writes work
- [ ] Environment variables loaded
- [ ] No console errors

### Mobile Tests
- [ ] Ad displays on mobile
- [ ] Touch events work
- [ ] Layout responsive
- [ ] Performance acceptable

### Production Tests
- [ ] AdSense ads load (after approval)
- [ ] HTTPS working
- [ ] Environment variables set
- [ ] Firestore rules correct
- [ ] Monitor for errors

---

## 🚨 Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `useSubscription is not defined` | Not imported | Add `import { useSubscription }` |
| Ad not showing | Dev mode enabled | Check `process.env.NODE_ENV` |
| Firestore 404 | Collection doesn't exist | Create collection in Firebase Console |
| CORS error | Backend not running | Run `cd backend && npm run dev` |
| Token invalid | Expired or bad auth | Check Firebase auth state |

---

## 📱 Performance Checklist

- [ ] Ad loading doesn't block gameplay
- [ ] Firestore queries optimized (indexes)
- [ ] Images optimized (lazy loading)
- [ ] Bundle size under 500KB
- [ ] Mobile performance >80
- [ ] Network requests <3 seconds
- [ ] No memory leaks

---

## 💰 Monetization Timeline

| When | Action | Revenue |
|------|--------|---------|
| Week 1-2 | Setup, no ads | $0 |
| Week 2-3 | Register AdSense | $0 (awaiting approval) |
| Week 3 | AdSense approved | $10-50/month |
| Week 4+ | Launch officially | $50-200/month (50 users) |
| Month 2 | Grow to 500 users | $200-1000/month |
| Month 3+ | Grow to 5000 users | $1000-5000/month |

(Estimates based on $1 CPM for SL region)

---

## 🎯 Success Metrics (First 30 Days)

### User Metrics
- DAU: 50-100
- Retention: >50% D7
- Avg session: 15+ min

### Ad Metrics
- Ad impressions: 500+/day
- CTR: 1-3%
- Completion rate: 60%+

### Revenue
- Monthly: $20-100 (estimated)
- Cost per user: $0 (free tier)
- CAC payback: Immediate (ad-supported)

---

## 📞 Support Resources

### Documentation
- `INTEGRATION_GUIDE.md` - Step-by-step setup
- `ARCHITECTURE.md` - System design
- `CONFIGURATION_GUIDE.md` - Config reference

### External Resources
- [Firebase Documentation](https://firebase.google.com/docs)
- [Google AdSense Setup](https://support.google.com/adsense)
- [React Context](https://react.dev/reference/react/useContext)
- [Express.js Guide](https://expressjs.com/)

### Debugging
1. Check browser console (F12)
2. Check backend logs (`npm run dev`)
3. Check Firestore Console
4. Check Firebase Auth logs
5. Check network requests (Network tab)

---

## 🔐 Security Checklist

- [ ] Environment variables in .env (not in code)
- [ ] Firebase token verified on every request
- [ ] Firestore rules restrict unauthorized access
- [ ] HTTPS enabled in production
- [ ] User consent for ads
- [ ] Data retention policy set
- [ ] Regular security audits
- [ ] Error messages don't leak info

---

## 📈 Growth Plan

### Month 1
- Launch Phase 1 (foundation)
- Get first 50 users
- Optimize ad placement
- Monitor metrics

### Month 2-3
- Launch Phase 2 (ads optimized)
- Grow to 500 users
- Add achievements
- Fix bugs based on feedback

### Month 4-6
- Launch Phase 3 (features)
- Grow to 5000 users
- Add cosmetics store
- Consider pro tier
- Expand to other regions

### Month 6+
- Optimize revenue
- Scale infrastructure
- Regional partnerships
- Investor meetings

---

## ⚡ Quick Commands

```bash
# Frontend development
npm start                  # Start dev server
npm run build             # Build for production
npm test                  # Run tests

# Backend development
cd backend
npm run dev              # Dev with nodemon
npm start                # Production
npm test                 # Run tests

# Combined
npm run dev:both         # Run both (requires concurrently)

# Deployment
npm run build
# Then push to Netlify / Git

# Database
# Firebase Console → Go to database
# Firestore → Create/Update collections

# Monitor logs
# Firebase Console → Logs
# Backend console
```

---

## 🎓 Learning Path

1. **Day 1**: Read all documentation (~2 hours)
2. **Day 2**: Setup & integrate (~3 hours)
3. **Day 3**: Test & debug (~2 hours)
4. **Day 4**: Register AdSense (~1 hour + waiting)
5. **Day 5**: Deploy to staging (~1 hour)
6. **Day 6-7**: Monitor & optimize (~4 hours)

**Total: ~13 hours over 1 week**

---

## 🎉 Next Steps

1. ✅ Start with `INTEGRATION_GUIDE.md`
2. ✅ Follow the step-by-step instructions
3. ✅ Test locally
4. ✅ Register with Google AdSense
5. ✅ Deploy to production
6. ✅ Monitor metrics
7. ✅ Iterate based on feedback

---

## 📞 Quick Help

**Q: Where do I add the SubscriptionProvider?**
A: In `src/App.js`, wrap your Router with it.

**Q: How do I test ads locally?**
A: Ads show as placeholders in development mode.

**Q: What if I don't have AdSense approval yet?**
A: Use test ad units for development, real ones after approval.

**Q: How much can I earn?**
A: Depends on users & CPM. Estimate: $1-5 per user monthly.

**Q: Can I add cosmetics later?**
A: Yes! Cosmetics are phase 3, not required for launch.

**Q: Do I need to change my existing code?**
A: Only add SubscriptionProvider & import new components. No breaking changes.

---

## 🎯 TL;DR

**What**: Free subscription model with ad-supported revenue
**Why**: Maximizes users in Sri Lanka, sustainable revenue
**How**: Ad-supported, optional cosmetics, no fees
**Timeline**: 4-5 weeks to launch (Phase 1-2)
**Cost**: Free (uses Google AdSense)
**Expected ROI**: Depends on user growth (high potential)

**Start Now**: Follow `INTEGRATION_GUIDE.md`

---

**Good luck! You've got this! 🚀**
