// ============ SUBSCRIPTION ENDPOINTS ============

const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();
const auth = admin.auth();

// Middleware to verify Firebase token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get user subscription tier and features
router.get('/api/subscription/user/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Users can only view their own subscription (or admins can view any)
    if (req.user.uid !== userId && !req.user.admin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      // Return default free tier if user doesn't exist yet
      return res.json({
        tier: 'free',
        joinedAt: new Date(),
        features: {
          unlimitedPlay: true,
          leaderboards: true,
          achievements: true,
          tournaments: true,
          customization: 'limited',
          profileBadges: false,
          exclusiveGames: false,
          adFree: false
        }
      });
    }

    const subscription = userDoc.data().subscription || {
      tier: 'free',
      joinedAt: new Date(),
      features: {
        unlimitedPlay: true,
        leaderboards: true,
        achievements: true,
        tournaments: true,
        customization: 'limited',
        profileBadges: false,
        exclusiveGames: false,
        adFree: false
      }
    };

    res.json(subscription);
  } catch (error) {
    console.error('Error getting subscription:', error);
    res.status(500).json({ error: 'Failed to get subscription' });
  }
});

// Track ad view (analytics)
router.post('/api/ads/track-view', verifyToken, async (req, res) => {
  try {
    const { gameId, adType, duration } = req.body;
    const userId = req.user.uid;

    if (!gameId || !adType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Log ad view for analytics and revenue tracking
    await db.collection('adAnalytics').add({
      userId,
      gameId,
      adType,
      duration: duration || 0,
      country: 'SL',
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    // Increment ad watch count in user analytics
    const userAnalyticsRef = db.collection('userAnalytics').doc(userId);
    await userAnalyticsRef.update({
      'adWatched.total': admin.firestore.FieldValue.increment(1),
      'adWatched.today': admin.firestore.FieldValue.increment(1)
    }).catch(async (error) => {
      // If doc doesn't exist, create it
      if (error.code === 'NOT_FOUND') {
        await userAnalyticsRef.set({
          adWatched: {
            total: 1,
            today: 1,
            thisMonth: 1
          }
        }, { merge: true });
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking ad:', error);
    res.status(500).json({ error: 'Failed to track ad' });
  }
});

// Claim ad reward (points for watching ads)
router.post('/api/rewards/claim-ad-reward', verifyToken, async (req, res) => {
  try {
    const { adType, points } = req.body;
    const userId = req.user.uid;

    if (!adType || !points) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate reasonable point values
    if (points < 1 || points > 100) {
      return res.status(400).json({ error: 'Invalid points value' });
    }

    // Add points to user
    const userAnalyticsRef = db.collection('userAnalytics').doc(userId);
    
    await userAnalyticsRef.update({
      'rewards.points': admin.firestore.FieldValue.increment(points),
      'adWatched.total': admin.firestore.FieldValue.increment(1),
      'adWatched.today': admin.firestore.FieldValue.increment(1)
    }).catch(async (error) => {
      // If doc doesn't exist, create it
      if (error.code === 'NOT_FOUND') {
        await userAnalyticsRef.set({
          rewards: {
            points: points,
            achievements: [],
            badges: [],
            cosmetics: []
          },
          adWatched: {
            total: 1,
            today: 1,
            thisMonth: 1
          }
        }, { merge: true });
      }
    });

    res.json({ success: true, points, message: `You earned ${points} points!` });
  } catch (error) {
    console.error('Error claiming reward:', error);
    res.status(500).json({ error: 'Failed to claim reward' });
  }
});

// Get cosmetics store
router.get('/api/cosmetics/store', async (req, res) => {
  try {
    // Get cosmetics for sale (would come from a collection)
    const cosmeticsRef = db.collection('cosmetics').where('available', '==', true);
    const cosmeticsSnap = await cosmeticsRef.get();

    const cosmetics = cosmeticsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      cosmetics,
      count: cosmetics.length
    });
  } catch (error) {
    console.error('Error fetching cosmetics:', error);
    res.status(500).json({ error: 'Failed to fetch cosmetics' });
  }
});

// Get achievements
router.get('/api/achievements/user/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Users can only view their own achievements (or admins)
    if (req.user.uid !== userId && !req.user.admin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const userAnalyticsRef = db.collection('userAnalytics').doc(userId);
    const userAnalyticsSnap = await userAnalyticsRef.get();

    if (!userAnalyticsSnap.exists) {
      return res.json({
        userId,
        achievements: [],
        badges: [],
        totalPoints: 0
      });
    }

    const data = userAnalyticsSnap.data();
    res.json({
      userId,
      achievements: data.rewards?.achievements || [],
      badges: data.rewards?.badges || [],
      totalPoints: data.rewards?.points || 0
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

// Get ad revenue analytics (admin only)
router.get('/api/admin/ad-analytics', verifyToken, async (req, res) => {
  try {
    const user = await auth.getUser(req.user.uid);
    if (!user.customClaims?.admin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const limit = Math.min(parseInt(req.query.limit) || 30, 100);
    const offset = parseInt(req.query.offset) || 0;

    // Get ad analytics
    const analyticsSnap = await db.collection('adAnalytics')
      .orderBy('timestamp', 'desc')
      .limit(limit + offset)
      .get();

    const analytics = analyticsSnap.docs.map((doc, index) => ({
      rank: offset + index + 1,
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.() || new Date()
    })).slice(offset);

    // Calculate metrics
    const totalAds = analyticsSnap.size;
    const adsByType = {};
    const adsByGame = {};

    analyticsSnap.docs.forEach(doc => {
      const data = doc.data();
      adsByType[data.adType] = (adsByType[data.adType] || 0) + 1;
      adsByGame[data.gameId] = (adsByGame[data.gameId] || 0) + 1;
    });

    res.json({
      analytics,
      totalAds,
      adsByType,
      topGames: Object.entries(adsByGame)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([gameId, count]) => ({ gameId, count })),
      limit,
      offset
    });
  } catch (error) {
    console.error('Error fetching ad analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;
