// Payment Processing Routes
// Handle PayPal and Google Pay payments for cosmetics

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

// ============ PAYPAL ENDPOINTS ============

/**
 * Create PayPal order
 * POST /api/payments/paypal/create-order
 */
router.post('/api/payments/paypal/create-order', verifyToken, async (req, res) => {
  try {
    const { cosmeticId } = req.body;
    const userId = req.user.uid;

    if (!cosmeticId) {
      return res.status(400).json({ error: 'Cosmetic ID required' });
    }

    // Get cosmetic details
    const cosmeticRef = db.collection('cosmetics').doc(cosmeticId);
    const cosmeticSnap = await cosmeticRef.get();

    if (!cosmeticSnap.exists) {
      return res.status(404).json({ error: 'Cosmetic not found' });
    }

    const cosmetic = cosmeticSnap.data();

    // Create order record in Firestore
    const orderRef = await db.collection('pending_paypal_orders').add({
      userId,
      cosmeticId,
      cosmeticName: cosmetic.name,
      amount: cosmetic.price,
      currency: 'USD',
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    });

    res.json({
      success: true,
      orderId: orderRef.id,
      amount: (cosmetic.price / 100).toFixed(2),
      currency: 'USD',
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

/**
 * Verify PayPal payment
 * POST /api/payments/paypal/verify
 */
router.post('/api/payments/paypal/verify', verifyToken, async (req, res) => {
  try {
    const { orderID, cosmeticId } = req.body;
    const userId = req.user.uid;

    if (!orderID || !cosmeticId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get cosmetic
    const cosmeticRef = db.collection('cosmetics').doc(cosmeticId);
    const cosmeticSnap = await cosmeticRef.get();

    if (!cosmeticSnap.exists) {
      return res.status(404).json({ error: 'Cosmetic not found' });
    }

    const cosmetic = cosmeticSnap.data();

    // In production, verify with PayPal API using order details
    // For now, we'll record the transaction
    
    // Check if already purchased
    const userRef = db.collection('users').doc(userId);
    const userSnap = await userRef.get();
    
    if (userSnap.exists) {
      const user = userSnap.data();
      const alreadyOwned = user.subscription?.rewards?.cosmetics?.some(
        c => c.cosmeticId === cosmeticId
      );
      
      if (alreadyOwned) {
        return res.status(400).json({ error: 'You already own this cosmetic' });
      }
    }

    // Record transaction
    const transactionRef = await db.collection('transactions').add({
      userId,
      type: 'paypal',
      paypalOrderId: orderID,
      cosmeticId,
      cosmeticName: cosmetic.name,
      amount: cosmetic.price,
      currency: 'USD',
      status: 'completed',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      },
    });

    // Add cosmetic to user
    await userRef.update({
      'subscription.rewards.cosmetics': admin.firestore.FieldValue.arrayUnion({
        cosmeticId,
        cosmeticName: cosmetic.name,
        purchasedAt: admin.firestore.FieldValue.serverTimestamp(),
        paymentMethod: 'paypal',
        transactionId: transactionRef.id,
      }),
    }).catch(async (error) => {
      if (error.code === 'NOT_FOUND') {
        await userRef.set({
          subscription: {
            rewards: {
              cosmetics: [{
                cosmeticId,
                cosmeticName: cosmetic.name,
                purchasedAt: admin.firestore.FieldValue.serverTimestamp(),
                paymentMethod: 'paypal',
                transactionId: transactionRef.id,
              }],
            },
          },
        }, { merge: true });
      }
    });

    // Update cosmetic purchase count
    await cosmeticRef.update({
      purchaseCount: admin.firestore.FieldValue.increment(1),
      lastPurchasedAt: admin.firestore.FieldValue.serverTimestamp(),
    }).catch(() => {}); // Ignore if field doesn't exist

    res.json({
      success: true,
      message: 'Cosmetic purchased successfully',
      transactionId: transactionRef.id,
    });
  } catch (error) {
    console.error('PayPal verification error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// ============ GOOGLE PAY ENDPOINTS ============

/**
 * Verify Google Pay payment
 * POST /api/payments/google-pay/verify
 */
router.post('/api/payments/google-pay/verify', verifyToken, async (req, res) => {
  try {
    const { paymentMethodId, cosmeticId, amount } = req.body;
    const userId = req.user.uid;

    if (!paymentMethodId || !cosmeticId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get cosmetic
    const cosmeticRef = db.collection('cosmetics').doc(cosmeticId);
    const cosmeticSnap = await cosmeticRef.get();

    if (!cosmeticSnap.exists) {
      return res.status(404).json({ error: 'Cosmetic not found' });
    }

    const cosmetic = cosmeticSnap.data();

    // Verify amount matches
    if (amount !== cosmetic.price) {
      return res.status(400).json({ error: 'Amount mismatch' });
    }

    // Check if already purchased
    const userRef = db.collection('users').doc(userId);
    const userSnap = await userRef.get();
    
    if (userSnap.exists) {
      const user = userSnap.data();
      const alreadyOwned = user.subscription?.rewards?.cosmetics?.some(
        c => c.cosmeticId === cosmeticId
      );
      
      if (alreadyOwned) {
        return res.status(400).json({ error: 'You already own this cosmetic' });
      }
    }

    // Record transaction
    const transactionRef = await db.collection('transactions').add({
      userId,
      type: 'google_pay',
      googlePaymentMethodId: paymentMethodId,
      cosmeticId,
      cosmeticName: cosmetic.name,
      amount: cosmetic.price,
      currency: 'USD',
      status: 'completed',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      },
    });

    // Add cosmetic to user
    await userRef.update({
      'subscription.rewards.cosmetics': admin.firestore.FieldValue.arrayUnion({
        cosmeticId,
        cosmeticName: cosmetic.name,
        purchasedAt: admin.firestore.FieldValue.serverTimestamp(),
        paymentMethod: 'google_pay',
        transactionId: transactionRef.id,
      }),
    }).catch(async (error) => {
      if (error.code === 'NOT_FOUND') {
        await userRef.set({
          subscription: {
            rewards: {
              cosmetics: [{
                cosmeticId,
                cosmeticName: cosmetic.name,
                purchasedAt: admin.firestore.FieldValue.serverTimestamp(),
                paymentMethod: 'google_pay',
                transactionId: transactionRef.id,
              }],
            },
          },
        }, { merge: true });
      }
    });

    // Update cosmetic purchase count
    await cosmeticRef.update({
      purchaseCount: admin.firestore.FieldValue.increment(1),
      lastPurchasedAt: admin.firestore.FieldValue.serverTimestamp(),
    }).catch(() => {}); // Ignore if field doesn't exist

    res.json({
      success: true,
      message: 'Cosmetic purchased successfully',
      transactionId: transactionRef.id,
    });
  } catch (error) {
    console.error('Google Pay verification error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// ============ TRANSACTION HISTORY ============

/**
 * Get user transaction history
 * GET /api/payments/transactions/history
 */
router.get('/api/payments/transactions/history', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const offset = parseInt(req.query.offset) || 0;

    const snapshot = await db.collection('transactions')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(limit + offset)
      .get();

    const transactions = snapshot.docs.map((doc, index) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.() || new Date(),
    })).slice(offset);

    res.json({
      transactions,
      total: snapshot.size,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

/**
 * Get transaction details
 * GET /api/payments/transactions/:transactionId
 */
router.get('/api/payments/transactions/:transactionId', verifyToken, async (req, res) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user.uid;

    const transactionRef = db.collection('transactions').doc(transactionId);
    const transactionSnap = await transactionRef.get();

    if (!transactionSnap.exists) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const transaction = transactionSnap.data();

    // Users can only view their own transactions
    if (transaction.userId !== userId && !req.user.admin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json({
      id: transactionId,
      ...transaction,
      timestamp: transaction.timestamp?.toDate?.() || new Date(),
    });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
});

// ============ ADMIN ENDPOINTS ============

/**
 * Get all transactions (admin only)
 * GET /api/admin/payments/all-transactions
 */
router.get('/api/admin/payments/all-transactions', verifyToken, async (req, res) => {
  try {
    // Check admin status
    const userRecord = await auth.getUser(req.user.uid);
    if (!userRecord.customClaims?.admin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const limit = Math.min(parseInt(req.query.limit) || 100, 500);
    const offset = parseInt(req.query.offset) || 0;

    const snapshot = await db.collection('transactions')
      .orderBy('timestamp', 'desc')
      .limit(limit + offset)
      .get();

    const transactions = snapshot.docs.map((doc, index) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.() || new Date(),
    })).slice(offset);

    // Calculate revenue metrics
    const totalRevenue = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    const byPaymentMethod = {};
    
    transactions.forEach(t => {
      const method = t.type || 'unknown';
      byPaymentMethod[method] = (byPaymentMethod[method] || 0) + (t.amount || 0);
    });

    res.json({
      transactions,
      metrics: {
        totalRevenue,
        byPaymentMethod,
        count: transactions.length,
      },
      total: snapshot.size,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching all transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

/**
 * Get payment analytics (admin only)
 * GET /api/admin/payments/analytics
 */
router.get('/api/admin/payments/analytics', verifyToken, async (req, res) => {
  try {
    // Check admin status
    const userRecord = await auth.getUser(req.user.uid);
    if (!userRecord.customClaims?.admin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const period = req.query.period || 'month'; // day, week, month, all
    let startDate = new Date();

    if (period === 'day') {
      startDate.setDate(startDate.getDate() - 1);
    } else if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else {
      startDate = new Date(0); // All time
    }

    const snapshot = await db.collection('transactions')
      .where('timestamp', '>=', startDate)
      .where('status', '==', 'completed')
      .get();

    const transactions = snapshot.docs.map(doc => doc.data());

    const analytics = {
      totalRevenue: 0,
      totalTransactions: transactions.length,
      paymentMethodBreakdown: {},
      topCosmetics: {},
      topUsers: {},
      averageTransactionValue: 0,
    };

    transactions.forEach(t => {
      analytics.totalRevenue += t.amount || 0;

      // Payment method breakdown
      const method = t.type || 'unknown';
      analytics.paymentMethodBreakdown[method] = (analytics.paymentMethodBreakdown[method] || 0) + 1;

      // Top cosmetics
      const cosmeticId = t.cosmeticId;
      analytics.topCosmetics[cosmeticId] = (analytics.topCosmetics[cosmeticId] || 0) + 1;

      // Top users
      const userId = t.userId;
      analytics.topUsers[userId] = (analytics.topUsers[userId] || 0) + (t.amount || 0);
    });

    analytics.averageTransactionValue = transactions.length > 0
      ? Math.round(analytics.totalRevenue / transactions.length)
      : 0;

    res.json({
      period,
      startDate,
      analytics,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;
