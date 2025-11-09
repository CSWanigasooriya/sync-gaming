# Subscription Model Implementation Checklist

## Phase 1: Foundation Setup (Week 1-2)

### Database Schema
- [ ] Create `users` collection with subscription field
- [ ] Add `adAnalytics` collection for tracking
- [ ] Create `cosmetics` collection (future use)
- [ ] Update `userAnalytics` to include rewards

### Frontend
- [ ] Create `SubscriptionContext.js`
- [ ] Create `AdBanner.js` component
- [ ] Wrap App.js with SubscriptionProvider
- [ ] Add AdBanner to main landing page (bottom)

### Backend
- [ ] Create `subscription.js` route file
- [ ] Add GET `/api/subscription/user/:userId`
- [ ] Add POST `/api/ads/track-view`
- [ ] Add POST `/api/rewards/claim-ad-reward`
- [ ] Import routes in `server.js`

### Environment Setup
- [ ] Create `.env` file with AdSense IDs (if available)
- [ ] Set `REACT_APP_ADSENSE_CLIENT_ID` in frontend
- [ ] Add ad placeholders for development mode

---

## Phase 2: Ad Integration (Week 2-3)

### Google AdSense Setup
- [ ] Register domain with Google AdSense
- [ ] Verify ownership
- [ ] Get Publisher ID and Slot IDs
- [ ] Add AdSense script to `public/index.html`
- [ ] Update component with real Ad IDs

### Ad Placement
- [ ] Add banner ad at bottom of landing page
- [ ] Add interstitial after game sessions
- [ ] Add banner on leaderboard page
- [ ] Test ad loading in development

### Analytics
- [ ] Track ad impressions
- [ ] Track ad clicks
- [ ] Calculate ad revenue (if using AdSense)
- [ ] Create admin dashboard for metrics

---

## Phase 3: User Features (Week 3-4)

### Authentication Flow
- [ ] Auto-assign "free" tier on signup
- [ ] Show tier on user profile
- [ ] Display subscription benefits in UI

### Achievement System
- [ ] Create sample achievements (e.g., "First 100 Points", "10 Games Played")
- [ ] Track achievement progress
- [ ] Display badges on profile
- [ ] Add achievement notifications

### Leaderboards Enhancement
- [ ] Add country filter (SL specific)
- [ ] Add friend leaderboards
- [ ] Show subscription tier badges

---

## Phase 4: Optional Monetization (Week 4-5)

### Cosmetics System (Optional - for future)
- [ ] Design cosmetic items (avatars, themes, etc.)
- [ ] Create cosmetics store component
- [ ] Setup cosmetics database
- [ ] Create purchase flow

### Payment Integration (Optional)
- [ ] Research Dialog Axiata OneMoney API
- [ ] Setup Stripe or local payment gateway
- [ ] Test microtransactions

---

## Quick Implementation Steps

### Step 1: Add SubscriptionProvider
```javascript
// In src/App.js
import { SubscriptionProvider } from './context/SubscriptionContext';

function App() {
  return (
    <SubscriptionProvider>
      <Router>
        {/* Routes */}
      </Router>
    </SubscriptionProvider>
  );
}
```

### Step 2: Add AdBanner to Landing Page
```javascript
// In src/App.js MainLanding component
import AdBanner from './components/AdBanner';

// Add before footer
<AdBanner position="bottom" adType="banner" />
```

### Step 3: Update Backend server.js
```javascript
// In backend/server.js
const subscriptionRoutes = require('./routes/subscription');
app.use(subscriptionRoutes);
```

### Step 4: Test Locally
```bash
# Frontend
npm start

# Backend (in another terminal)
cd backend
npm run dev
```

---

## Testing Checklist

- [ ] User can sign up and gets "free" tier
- [ ] Ad banner renders in development mode
- [ ] Subscription context loads without errors
- [ ] Ad tracking works (check Firestore)
- [ ] Ad reward endpoint functions correctly
- [ ] Admin can view ad analytics
- [ ] Leaderboards show tier badges
- [ ] Mobile responsiveness works

---

## Deployment Checklist

- [ ] Environment variables set in production
- [ ] AdSense script included in HTML
- [ ] Ad slot IDs match production settings
- [ ] Privacy policy updated
- [ ] Terms of Service updated
- [ ] GDPR/privacy compliance reviewed
- [ ] Test on Sri Lankan networks
- [ ] Monitor ad revenue tracking

---

## Metrics to Monitor (Post-Launch)

- Daily Active Users
- Ad impressions per user
- Ad completion rate
- User retention (Day 1, 7, 30)
- Revenue per user (ARPU)
- Leaderboard engagement rate
- Average session duration

---

## Known Limitations (Phase 1 Free Tier)

❌ No actual payment processing
❌ No premium tier yet
❌ Cosmetics are UI-only (not functional)
❌ No advanced analytics for users

✅ All above planned for Phase 3-4

---

## Support Resources

- [Google AdSense Setup Guide](https://support.google.com/adsense/answer/7307141)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)
- [React Context API](https://react.dev/reference/react/useContext)

---

## Notes

- Ensure no ads show during active gameplay
- Keep ad frequency low to avoid user frustration
- Test on slow networks (common in Sri Lanka)
- Monitor compliance with gaming regulations
- Consider local partnerships early

**Estimated Total Time**: 4-5 weeks for Phase 1-2
**Maintenance After Launch**: ~5-10 hours/week for monitoring and optimization
