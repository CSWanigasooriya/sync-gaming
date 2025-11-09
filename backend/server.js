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
