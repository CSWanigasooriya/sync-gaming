const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const dotenv = require('dotenv');

// Load environment variables
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const app = express();

// Middleware
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://hilarious-crostata-bb59b0.netlify.app'] // Your Netlify URL
  : ['http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// Initialize Firebase Admin SDK
let serviceAccount;
try {
  // Try to use environment variable first (for Render deployment)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    // Fallback to local file (for development)
    serviceAccount = require('./serviceAccountKey.json');
  }
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL || "https://gen-lang-client-0350765152.firebaseio.com"
  });
  
  console.log('Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('Failed to initialize Firebase Admin SDK:', error.message);
  process.exit(1);
}

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

// Middleware to verify admin claims
const verifyAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const userRecord = await auth.getUser(req.user.uid);
    const claims = userRecord.customClaims || {};
    
    if (!claims.admin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    req.isAdmin = true;
    next();
  } catch (error) {
    console.error('Admin verification failed:', error);
    res.status(403).json({ error: 'Admin verification failed' });
  }
};

// ============ PUBLIC ENDPOINTS ============

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running!' });
});

// ============ AUTH ENDPOINTS ============

// Get current user's claims
app.get('/api/auth/me', verifyToken, async (req, res) => {
  try {
    const userRecord = await auth.getUser(req.user.uid);
    const customClaims = userRecord.customClaims || {};
    
    res.json({
      uid: req.user.uid,
      email: req.user.email,
      displayName: req.user.name,
      isAdmin: customClaims.admin === true,
      customClaims
    });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: 'Failed to get user information' });
  }
});

// ============ ADMIN ENDPOINTS ============

// Set user as admin
app.post('/api/admin/set-admin', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { uid, email } = req.body;

    if (!uid && !email) {
      return res.status(400).json({ error: 'Either uid or email is required' });
    }

    // Get user by uid or email
    let userRecord;
    if (uid) {
      userRecord = await auth.getUser(uid);
    } else {
      userRecord = await auth.getUserByEmail(email);
    }

    // Set admin custom claim
    await auth.setCustomUserClaims(userRecord.uid, {
      ...userRecord.customClaims,
      admin: true
    });

    // Log to Firestore for audit trail
    await db.collection('admin-audit-logs').add({
      action: 'SET_ADMIN',
      targetUser: userRecord.email,
      targetUid: userRecord.uid,
      performedBy: req.user.email,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({
      message: `User ${userRecord.email} is now an admin`,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        isAdmin: true
      }
    });
  } catch (error) {
    console.error('Error setting admin:', error);
    if (error.code === 'auth/user-not-found') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Failed to set admin: ' + error.message });
  }
});

// Remove admin access from user
app.post('/api/admin/remove-admin', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { uid, email } = req.body;

    if (!uid && !email) {
      return res.status(400).json({ error: 'Either uid or email is required' });
    }

    // Get user by uid or email
    let userRecord;
    if (uid) {
      userRecord = await auth.getUser(uid);
    } else {
      userRecord = await auth.getUserByEmail(email);
    }

    // Remove admin custom claim
    const newClaims = { ...(userRecord.customClaims || {}) };
    delete newClaims.admin;

    await auth.setCustomUserClaims(userRecord.uid, newClaims);

    // Log to Firestore for audit trail
    await db.collection('admin-audit-logs').add({
      action: 'REMOVE_ADMIN',
      targetUser: userRecord.email,
      targetUid: userRecord.uid,
      performedBy: req.user.email,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({
      message: `Admin access removed from ${userRecord.email}`,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        isAdmin: false
      }
    });
  } catch (error) {
    console.error('Error removing admin:', error);
    if (error.code === 'auth/user-not-found') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Failed to remove admin: ' + error.message });
  }
});

// List all admins
app.get('/api/admin/list-admins', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const adminUsers = [];
    const listUsersResult = await auth.listUsers();

    for (const userRecord of listUsersResult.users) {
      if (userRecord.customClaims && userRecord.customClaims.admin) {
        adminUsers.push({
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName,
          createdAt: userRecord.metadata.creationTime
        });
      }
    }

    res.json({
      admins: adminUsers,
      count: adminUsers.length
    });
  } catch (error) {
    console.error('Error listing admins:', error);
    res.status(500).json({ error: 'Failed to list admins' });
  }
});

// Get admin audit logs
app.get('/api/admin/audit-logs', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection('admin-audit-logs')
      .orderBy('timestamp', 'desc')
      .limit(50)
      .get();

    const logs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.() || new Date()
    }));

    res.json({ logs });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// ============ LEADERBOARD ENDPOINTS ============

// Submit game score
app.post('/api/scores/submit', verifyToken, async (req, res) => {
  try {
    const { gameId, score, duration } = req.body;
    
    if (!gameId || score === undefined || !duration) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const userId = req.user.uid;
    const userEmail = req.user.email || 'Unknown';
    const userName = req.user.name || userEmail.split('@')[0];

    // Add score to leaderboard
    const scoreRef = await db.collection('leaderboard').doc(gameId).collection('scores').add({
      userId,
      userName,
      userEmail,
      score: Number(score),
      duration: Number(duration),
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      gameId
    });

    // Update user analytics
    const userAnalyticsRef = db.collection('userAnalytics').doc(userId);
    const userAnalyticsSnap = await userAnalyticsRef.get();

    if (userAnalyticsSnap.exists) {
      const currentData = userAnalyticsSnap.data();
      const gamesPlayed = currentData.gamesPlayed || {};
      const gameStats = gamesPlayed[gameId] || { timesPlayed: 0, bestScore: 0, totalTime: 0, averageScore: 0 };

      gameStats.timesPlayed = (gameStats.timesPlayed || 0) + 1;
      gameStats.bestScore = Math.max(gameStats.bestScore || 0, score);
      gameStats.totalTime = (gameStats.totalTime || 0) + duration;
      gameStats.averageScore = gameStats.bestScore;

      gamesPlayed[gameId] = gameStats;

      await userAnalyticsRef.update({
        totalGamesPlayed: admin.firestore.FieldValue.increment(1),
        totalPlayTime: admin.firestore.FieldValue.increment(duration),
        totalScore: admin.firestore.FieldValue.increment(score),
        averageScore: admin.firestore.FieldValue.increment(score),
        lastPlayed: admin.firestore.FieldValue.serverTimestamp(),
        gamesPlayed,
        'playHistory': admin.firestore.FieldValue.arrayUnion({
          gameId,
          score,
          duration,
          timestamp: new Date()
        })
      });
    } else {
      // Create new analytics document
      await userAnalyticsRef.set({
        totalGamesPlayed: 1,
        totalPlayTime: duration,
        totalScore: score,
        averageScore: score,
        lastPlayed: admin.firestore.FieldValue.serverTimestamp(),
        gamesPlayed: {
          [gameId]: {
            timesPlayed: 1,
            bestScore: score,
            totalTime: duration,
            averageScore: score
          }
        },
        playHistory: [{
          gameId,
          score,
          duration,
          timestamp: new Date()
        }]
      });
    }

    // Get rank for this score
    const allScores = await db.collection('leaderboard').doc(gameId)
      .collection('scores')
      .orderBy('score', 'desc')
      .get();

    let rank = 1;
    allScores.docs.forEach((doc, index) => {
      if (doc.id === scoreRef.id) rank = index + 1;
    });

    res.json({
      success: true,
      message: 'Score saved successfully',
      scoreId: scoreRef.id,
      rank
    });
  } catch (error) {
    console.error('Error submitting score:', error);
    res.status(500).json({ error: 'Failed to submit score' });
  }
});

// Get leaderboard for a game
app.get('/api/leaderboard/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const offset = parseInt(req.query.offset) || 0;

    const snapshot = await db.collection('leaderboard').doc(gameId)
      .collection('scores')
      .orderBy('score', 'desc')
      .limit(limit + offset)
      .get();

    const leaderboard = snapshot.docs.map((doc, index) => ({
      rank: offset + index + 1,
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.() || new Date()
    })).slice(offset);

    const totalScores = snapshot.size;

    res.json({
      gameId,
      leaderboard,
      totalScores,
      limit,
      offset
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get user analytics
app.get('/api/analytics/user/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Allow users to view their own analytics or admins to view any
    if (req.user.uid !== userId && !req.user.admin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const analytics = await db.collection('userAnalytics').doc(userId).get();

    if (!analytics.exists) {
      return res.json({
        userId,
        totalGamesPlayed: 0,
        totalPlayTime: 0,
        totalScore: 0,
        averageScore: 0,
        gamesPlayed: {},
        playHistory: []
      });
    }

    res.json({
      userId,
      ...analytics.data()
    });
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    res.status(500).json({ error: 'Failed to fetch user analytics' });
  }
});

// Get game analytics (admin only)
app.get('/api/analytics/game/:gameId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { gameId } = req.params;

    const analytics = await db.collection('gameAnalytics').doc(gameId).get();

    if (!analytics.exists) {
      return res.json({
        gameId,
        totalPlays: 0,
        totalPlayers: 0,
        averageScore: 0,
        highScore: 0,
        topPlayers: [],
        dailyStats: {}
      });
    }

    res.json({
      gameId,
      ...analytics.data()
    });
  } catch (error) {
    console.error('Error fetching game analytics:', error);
    res.status(500).json({ error: 'Failed to fetch game analytics' });
  }
});

// Get all users analytics (admin only)
app.get('/api/analytics/all-users', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);
    const offset = parseInt(req.query.offset) || 0;

    const snapshot = await db.collection('userAnalytics')
      .orderBy('totalPlayTime', 'desc')
      .limit(limit + offset)
      .get();

    const users = snapshot.docs.map((doc, index) => ({
      rank: offset + index + 1,
      userId: doc.id,
      ...doc.data()
    })).slice(offset);

    res.json({
      users,
      total: snapshot.size,
      limit,
      offset
    });
  } catch (error) {
    console.error('Error fetching all user analytics:', error);
    res.status(500).json({ error: 'Failed to fetch user analytics' });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});
