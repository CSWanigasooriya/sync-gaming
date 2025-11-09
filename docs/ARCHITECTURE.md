# Architecture Overview: Free Subscription Model

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  App.js (with SubscriptionProvider wrapper)                     │
│    ├─ MainLanding                                               │
│    │  └─ AdBanner Component (bottom)                            │
│    ├─ Auth Page                                                 │
│    ├─ GamePlayer                                                │
│    ├─ LeaderboardModal (with tier badges)                       │
│    └─ AdminDashboard                                            │
│                                                                  │
│  Context:                                                        │
│    └─ SubscriptionContext                                       │
│       ├─ Subscription state                                     │
│       ├─ User data                                              │
│       └─ Loading state                                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
           │                              │
           │ Firebase Auth               │ API Calls
           │                             │
           ▼                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js/Express)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  server.js                                                       │
│  ├─ Middleware:                                                 │
│  │  ├─ CORS                                                    │
│  │  ├─ Express.json                                            │
│  │  ├─ verifyToken                                             │
│  │  └─ verifyAdmin                                             │
│  │                                                              │
│  └─ Routes:                                                    │
│     ├─ subscription.js                                         │
│     │  ├─ GET /api/subscription/user/:userId                  │
│     │  ├─ POST /api/ads/track-view                            │
│     │  ├─ POST /api/rewards/claim-ad-reward                   │
│     │  ├─ GET /api/achievements/user/:userId                 │
│     │  ├─ GET /api/cosmetics/store                           │
│     │  └─ GET /api/admin/ad-analytics                        │
│     │                                                          │
│     ├─ (existing routes for games/leaderboard)               │
│     └─ (existing routes for admin)                           │
│                                                                │
└─────────────────────────────────────────────────────────────────┘
           │
           │ Firebase Admin SDK
           │
           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FIREBASE (Backend as Service)                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Firestore Collections:                                          │
│  ├─ users (new fields)                                          │
│  │  ├─ subscription.tier                                       │
│  │  ├─ subscription.features                                   │
│  │  └─ subscription.rewards                                    │
│  │                                                              │
│  ├─ adAnalytics (new)                                          │
│  │  ├─ userId                                                  │
│  │  ├─ gameId                                                  │
│  │  ├─ adType                                                  │
│  │  ├─ timestamp                                               │
│  │  └─ country                                                 │
│  │                                                              │
│  ├─ userAnalytics (updated)                                    │
│  │  ├─ adWatched                                              │
│  │  └─ rewards                                                 │
│  │                                                              │
│  ├─ gameSettings (new)                                         │
│  │  ├─ adConfig                                               │
│  │  └─ featureFlags                                           │
│  │                                                              │
│  ├─ leaderboard (existing)                                     │
│  ├─ games (existing)                                           │
│  └─ cosmetics (future)                                         │
│                                                                │
│  Firebase Auth (existing)                                       │
│  Firebase Storage (existing)                                    │
│                                                                │
└─────────────────────────────────────────────────────────────────┘
           │
           ├─ Google AdSense API
           │
           ├─ Payment Gateways (future)
           │  ├─ Stripe
           │  ├─ Dialog mWallet
           │  └─ Mobitel mCash
           │
           └─ Ad Networks
              ├─ Google AdSense (primary)
              ├─ Facebook Audience Network
              └─ ironSource
```

---

## Data Flow Diagrams

### 1. User Registration Flow

```
User Signs Up
    │
    ├─ Auth.js: signUp()
    │  │
    │  ├─ Firebase Auth: createUserWithEmailAndPassword()
    │  │
    │  └─ getIdTokenResult()
    │
    ├─ SubscriptionContext: useEffect on auth state
    │  │
    │  ├─ User document doesn't exist
    │  │
    │  └─ setDoc() → Creates user doc with FREE tier
    │
    ├─ Firestore users/{uid}
    │  ├─ email
    │  ├─ displayName
    │  ├─ subscription: { tier: 'free', features: {...} }
    │  └─ preferences
    │
    └─ User Profile Updated in App
```

### 2. Ad Tracking Flow

```
Game Ends
    │
    ├─ Show Ad (interstitial)
    │  │
    │  ├─ User watches ad (5-30 seconds)
    │  │
    │  └─ Ad completion callback
    │
    ├─ Frontend: Track ad view
    │  │
    │  ├─ POST /api/ads/track-view
    │  │  ├─ gameId
    │  │  ├─ adType
    │  │  └─ duration
    │  │
    │  └─ Bearer token (Auth)
    │
    ├─ Backend: Save to Firestore
    │  │
    │  ├─ adAnalytics collection
    │  │
    │  └─ Increment user adWatched counter
    │
    ├─ Firestore: adAnalytics/{docId}
    │  ├─ userId
    │  ├─ gameId
    │  ├─ adType: 'banner' | 'interstitial' | 'rewarded'
    │  ├─ duration: 5
    │  ├─ timestamp
    │  └─ country: 'SL'
    │
    └─ Analytics Dashboard Updated
```

### 3. Reward Claiming Flow

```
User Watches Reward Video
    │
    ├─ Ad Network: Completes video
    │  │
    │  └─ Callback to app
    │
    ├─ Frontend: POST /api/rewards/claim-ad-reward
    │  ├─ adType: 'rewarded_video'
    │  ├─ points: 10
    │  └─ Bearer token
    │
    ├─ Backend: Verify and update
    │  │
    │  ├─ Check daily limit (optional)
    │  │
    │  ├─ Increment user points
    │  │
    │  └─ Update userAnalytics
    │
    ├─ Firestore: userAnalytics/{userId}
    │  └─ rewards.points: +10
    │
    └─ UI: Show "You earned 10 points!"
```

### 4. Leaderboard with Tier Badges

```
User Views Leaderboard
    │
    ├─ LeaderboardModal fetches scores
    │  │
    │  ├─ GET /api/leaderboard/:gameId
    │  │
    │  └─ Returns: [{ userId, score, userName, ... }]
    │
    ├─ For each user in leaderboard
    │  │
    │  ├─ Get subscription tier
    │  │  │
    │  │  ├─ useSubscription() for current user
    │  │  │
    │  │  └─ GET /api/subscription/user/:userId for others
    │  │
    │  ├─ Render badge based on tier
    │  │  ├─ FREE tier: 👤 (default)
    │  │  ├─ PRO tier: ⭐ (future)
    │  │  └─ SPONSOR tier: 🏆 (future)
    │  │
    │  └─ Display score with badge
    │
    └─ Leaderboard Displayed
```

---

## Feature Matrix

| Feature | Free Tier | Pro Tier* | Status |
|---------|-----------|-----------|--------|
| **Core Features** |
| Play Games | ✅ Unlimited | ✅ Unlimited | Ready |
| Leaderboards | ✅ Yes | ✅ Yes | Ready |
| Achievements | ✅ Yes | ✅ Yes | Ready |
| Tournaments | ✅ Free Entry | ✅ Free Entry | Ready |
| **Ads** |
| See Ads | ✅ Yes | ❌ No | Phase 2 |
| Watch Reward Ads | ✅ Yes | ❌ No | Phase 2 |
| Earn Points | ✅ Yes | ❌ No | Phase 2 |
| **Customization** |
| Profile Avatar | ✅ Basic | ✅ Advanced | Phase 3 |
| Theme Selection | ✅ 2 Free | ✅ All | Phase 3 |
| Cosmetics | ❌ Limited | ✅ Buy | Phase 3 |
| **Social** |
| Friend List | ✅ Yes | ✅ Yes | Ready |
| Share Scores | ✅ Yes | ✅ Yes | Ready |
| In-Game Chat | ✅ Yes | ✅ Yes | Ready |

*Pro Tier is optional, planned for 6+ months after launch

---

## Implementation Phases Timeline

```
WEEK 1-2: PHASE 1 - Foundation
├─ Setup SubscriptionContext
├─ Create AdBanner component
├─ Add backend endpoints
├─ Create Firestore schema
└─ Local testing
    ↓
WEEK 2-3: PHASE 2 - Ad Integration
├─ Register with Google AdSense
├─ Integrate ad networks
├─ Add ad tracking
├─ Test ads locally
└─ Deploy to staging
    ↓
WEEK 3-4: PHASE 3 - Features
├─ Add achievements
├─ Enhance leaderboards
├─ Add social features
├─ Create cosmetics system
└─ User testing
    ↓
WEEK 4-5: PHASE 4 - Launch
├─ Deploy to production
├─ Enable real ads
├─ Monitor metrics
├─ Fix bugs
└─ Optimize performance
    ↓
ONGOING: MAINTENANCE & GROWTH
├─ Daily monitoring
├─ Weekly optimization
├─ Monthly analysis
└─ Quarterly planning
```

---

## Monetization Flow

```
Users (Free)
    │
    ├─ 1000 Users → 500 Sessions/day
    │
    ├─ Ad Impressions
    │  │
    │  ├─ 500 banner ads/day
    │  │
    │  ├─ 200 interstitial ads/day
    │  │
    │  └─ Ad Network: $0.50-2.00 per 1000 impressions (CPM)
    │
    ├─ Revenue Calculation
    │  │
    │  ├─ 700 ads/day × 30 days = 21,000 ads/month
    │  │
    │  ├─ CPM = $1.00 (average for SL region)
    │  │
    │  └─ Monthly Revenue = 21,000 × ($1.00/1000) = $21
    │     (This scales up with more users)
    │
    ├─ Secondary Revenue (Cosmetics - Future)
    │  │
    │  ├─ 10% conversion to buying cosmetics
    │  │
    │  ├─ 100 cosmetics/month × 150 LKR = 15,000 LKR
    │  │
    │  └─ Gross Revenue from cosmetics: $50+
    │
    └─ Total Monthly Revenue: $70+ (scales with growth)
```

---

## Database Schema Overview

### Collection: users (Updated)
```javascript
{
  uid: "user123",
  email: "user@example.com",
  displayName: "Player Name",
  avatar: "url",
  country: "SL",
  createdAt: timestamp,
  subscription: {
    tier: "free",
    joinedAt: timestamp,
    features: {
      unlimitedPlay: true,
      leaderboards: true,
      achievements: true,
      tournaments: true,
      customization: "limited",
      profileBadges: false,
      exclusiveGames: false,
      adFree: false
    },
    adWatchCount: 5,
    rewards: {
      points: 50,
      achievements: ["first_game", "100_points"],
      badges: ["player_badge"],
      cosmetics: []
    }
  },
  preferences: {
    language: "en",
    themeMode: "dark",
    adConsent: true,
    dataConsent: true,
    notifications: true
  }
}
```

### Collection: adAnalytics (New)
```javascript
{
  userId: "user123",
  gameId: "snake-game",
  adType: "banner",
  duration: 5,
  country: "SL",
  timestamp: 2024-11-09T12:34:56Z
}
```

### Collection: gameSettings (New)
```javascript
{
  adConfig: {
    enabled: true,
    frequency: "low",
    maxAdsPerDay: 10,
    minTimeBetweenAds: 15,
    placementTypes: ["banner", "interstitial", "rewarded"],
    testMode: false
  },
  featureFlags: {
    subscriptionEnabled: false,
    cosmetics: false,
    tournaments: true
  }
}
```

---

## API Endpoints Summary

### Public Endpoints
```
GET  /api/health                          → Check backend status
GET  /api/leaderboard/:gameId             → Get leaderboard
GET  /api/cosmetics/store                 → Get cosmetics
```

### Authenticated Endpoints
```
GET  /api/subscription/user/:userId       → Get user subscription
GET  /api/achievements/user/:userId       → Get user achievements
POST /api/ads/track-view                  → Track ad impression
POST /api/rewards/claim-ad-reward         → Claim ad reward points
POST /api/scores/submit                   → Submit game score
```

### Admin Endpoints
```
GET  /api/admin/ad-analytics              → Analytics dashboard
GET  /api/analytics/all-users             → User metrics
GET  /api/analytics/game/:gameId          → Game metrics
```

---

## Key Metrics to Track

```
User Metrics:
├─ Daily Active Users (DAU)
├─ Monthly Active Users (MAU)
├─ User Retention (D1, D7, D30)
├─ Average Session Duration
└─ Games Played Per User

Ad Metrics:
├─ Ad Impressions
├─ Ad Clicks
├─ Click-Through Rate (CTR)
├─ Ad Completion Rate
├─ Cost Per Mille (CPM)
└─ Revenue Per User (ARPU)

Engagement Metrics:
├─ Leaderboard Views
├─ Achievement Unlock Rate
├─ Tournament Participation
├─ Social Shares
└─ Game Replay Rate
```

---

## Security Model

```
Authentication Layer
├─ Firebase Auth (tokens)
│  └─ Email/Password + Google OAuth
│
Authorization Layer
├─ Firestore Rules
│  ├─ Users can only access their own data
│  ├─ Admins can access analytics
│  └─ Leaderboards are public
│
├─ Backend Middleware
│  ├─ verifyToken (checks Firebase token)
│  └─ verifyAdmin (checks admin claims)
│
Data Protection
├─ Sensitive data in environment variables
├─ HTTPS in production (required for ads)
├─ User consent for personalized ads
└─ Data retention policies (SL compliance)
```

---

## Scaling Considerations

### Phase 1 (0-1000 users)
- Single Firestore database
- Single backend server
- Basic analytics

### Phase 2 (1000-10000 users)
- Firestore optimization (indexing)
- Multiple backend instances (load balancing)
- Enhanced analytics dashboard
- Local CDN for ads

### Phase 3 (10000+ users)
- Firestore sharding
- Dedicated backend infrastructure
- Advanced analytics (ML-based)
- Multiple ad networks
- Regional optimizations

---

This architecture is designed to be:
- ✅ **Scalable**: Grows from 100 to 100,000+ users
- ✅ **Maintainable**: Clear separation of concerns
- ✅ **Flexible**: Easy to add features (cosmetics, pro tier, etc.)
- ✅ **Cost-Effective**: Minimal infrastructure costs initially
- ✅ **Sri Lanka Focused**: Optimized for local conditions
