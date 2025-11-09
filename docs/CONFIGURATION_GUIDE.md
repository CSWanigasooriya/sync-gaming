# Subscription Model Configuration

## Environment Variables Template

Create a `.env` file in the root and `.env` in `backend/` directory:

### Frontend (.env)
```bash
# Google AdSense Configuration
REACT_APP_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
REACT_APP_ADSENSE_SLOT_BANNER=xxxxxxxxxx
REACT_APP_ADSENSE_SLOT_INTERSTITIAL=xxxxxxxxxx

# Firebase Configuration (already in firebase.js)
REACT_APP_FIREBASE_API_KEY=your_api_key

# Feature Flags
REACT_APP_ADS_ENABLED=true
REACT_APP_COSMETICS_ENABLED=false
REACT_APP_TOURNAMENTS_ENABLED=true

# Environment
REACT_APP_ENV=development
```

### Backend (.env)
```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Firebase Configuration
FIREBASE_DATABASE_URL=https://gen-lang-client-0350765152.firebaseio.com
FIREBASE_SERVICE_ACCOUNT={paste_service_account_json}

# Ad Configuration
AD_ANALYTICS_ENABLED=true
AD_REWARD_POINTS=10

# Cosmetics Configuration (future)
COSMETICS_ENABLED=false
COSMETICS_STORE_OPEN=false

# Payment Configuration (future)
PAYMENT_GATEWAY=stripe
STRIPE_SECRET_KEY=sk_test_xxxxx
```

### Backend Firebase Setup

If using environment variable for service account:

```bash
# Linux/Mac
export FIREBASE_SERVICE_ACCOUNT='{"type":"service_account",...}'

# Windows PowerShell
$env:FIREBASE_SERVICE_ACCOUNT='{"type":"service_account",...}'
```

Or copy `serviceAccountKey.json` to backend folder (already done).

---

## Configuration Files

### Firestore Security Rules (Update existing)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      allow read: if request.auth != null; // Others can see public profile
    }
    
    // Admins can read analytics
    match /adAnalytics/{document=**} {
      allow read: if request.auth.token.admin == true;
      allow create: if request.auth != null;
    }
    
    // Users can read achievements
    match /userAnalytics/{userId} {
      allow read, write: if request.auth.uid == userId;
      allow read: if request.auth.token.admin == true;
    }
    
    // Cosmetics are public read
    match /cosmetics/{document=**} {
      allow read: if true;
      allow write: if request.auth.token.admin == true;
    }
    
    // Leaderboards are public read
    match /leaderboard/{gameId}/scores/{scoreId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## Feature Flags Configuration

### Default Configuration (gameSettings collection)

```javascript
{
  adConfig: {
    enabled: true,
    frequency: "low", // low | medium | high
    maxAdsPerDay: 10,
    minTimeBetweenAds: 15, // minutes
    placementTypes: ["banner", "interstitial", "rewarded"],
    bannerPosition: "bottom",
    adNetwork: "google-adsense",
    testMode: true // Set false in production
  },
  
  featureFlags: {
    subscriptionEnabled: false,
    cosmetics: false,
    tournaments: true,
    socialFeatures: true,
    achievements: true,
    leaderboards: true,
    countryLeaderboards: true
  },
  
  monetizationConfig: {
    adRevenueSplit: 70, // % to platform
    cosmetics: {
      enabled: false,
      priceRange: [50, 200], // LKR
      currencies: ["LKR", "USD"],
      paymentMethods: ["airtime", "moneywallet", "bank"]
    }
  },
  
  userLimits: {
    freeMaxGamesPerDay: 999, // unlimited
    freeMaxPlayTime: 999, // unlimited
    freeProfileCustomization: "limited",
    freeBadges: true,
    freeAchievements: true
  }
}
```

### Firebase Console: Create Document

1. Go to Firestore Database in Firebase Console
2. Create collection: `gameSettings`
3. Create document: `config`
4. Add the fields above

---

## Integration Steps

### 1. Update package.json scripts

```json
{
  "scripts": {
    "start": "react-scripts start",
    "dev": "node dev-server.js",
    "backend": "cd backend && npm run dev",
    "dev:both": "concurrently \"npm start\" \"npm run backend\"",
    "build": "react-scripts build",
    "test": "react-scripts test"
  }
}
```

Install concurrently:
```bash
npm install --save-dev concurrently
```

### 2. Update public/index.html

Add Google AdSense script (in `<head>`):

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx"
     crossorigin="anonymous"></script>
```

### 3. Update backend/server.js

```javascript
// After other route imports
const subscriptionRoutes = require('./routes/subscription');

// After middleware setup
app.use(subscriptionRoutes);
```

### 4. Create .env files

Copy the template above to `.env` in root and `backend/.env`

---

## Ad Network Options for Sri Lanka

### 1. Google AdSense (Recommended)
- Global standard
- Works in Sri Lanka (with local payment method)
- Easy integration
- Moderate CPM for region

**Setup**:
```
1. Register domain
2. Apply at google.com/adsense
3. Add code to index.html
4. Create ad slots
5. Wait for approval (1-7 days)
```

### 2. Facebook Audience Network
- Higher CPM in South Asia
- Requires Facebook Business Account
- Good for game content

**Setup**:
```
1. Create Facebook Business Account
2. Create Audience Network property
3. Get placement IDs
4. Integrate Facebook SDK
```

### 3. ironSource
- Gaming-focused ads
- Multiple ad formats
- Good fill rates

**Setup**:
```
1. Register at ironsource.com
2. Create app
3. Get app key
4. Integrate SDK
```

---

## Testing Ad Integration

### Development Mode

```javascript
// In AdBanner.js - Already configured
if (process.env.NODE_ENV === 'development') {
  // Show placeholder ads
}
```

### Test Ad Units

Google AdSense provides test ad units:
```
Publisher ID: ca-pub-3940256099942544
```

Test IDs for banner:
```
6300978111
```

Use these in development before switching to production IDs.

---

## Security Considerations

### 1. API Rate Limiting
```javascript
// In backend/server.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 2. Input Validation
All POST endpoints should validate inputs:
```javascript
if (!gameId || typeof score !== 'number') {
  return res.status(400).json({ error: 'Invalid input' });
}
```

### 3. Ad Fraud Prevention
- Track ad watches per user per hour
- Flag suspicious patterns
- Validate ad completion times

---

## Monitoring & Analytics

### Metrics Dashboard (Future)

```javascript
// Components to create:
// - AdminAdAnalytics.js
// - AdminMonetizationDashboard.js
// - AdminUserInsights.js

// Key metrics:
// 1. Ad impressions/day
// 2. Click-through rate
// 3. Revenue/user
// 4. User retention
// 5. Game engagement
```

---

## Troubleshooting

### Ads Not Showing

1. Check if `process.env.NODE_ENV === 'production'`
2. Verify AdSense script in HTML
3. Check browser console for errors
4. Ensure AdSense is approved
5. Check Ad blocker settings

### Low Ad Revenue

1. Increase ad placement strategically
2. Optimize ad format placement
3. Ensure high user traffic
4. Monitor fill rates
5. Consider multiple ad networks

### Firebase Errors

1. Verify Firestore rules
2. Check authentication token
3. Ensure collections exist
4. Monitor Firestore quota

---

## Next Steps

1. ✅ Create environment files
2. ✅ Update index.html with AdSense
3. ✅ Add SubscriptionProvider
4. ✅ Test ad integration locally
5. ✅ Deploy to staging
6. ✅ Monitor metrics
7. ✅ Optimize based on data

---

## Resources

- [Google AdSense Setup](https://support.google.com/adsense)
- [Facebook Audience Network](https://www.facebook.com/audience-network)
- [ironSource Documentation](https://developers.ironsrc.com/)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security)

