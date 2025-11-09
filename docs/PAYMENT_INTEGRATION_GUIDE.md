# Payment Integration Guide: PayPal & Google Wallet

## Overview

This guide explains how to integrate **PayPal** and **Google Wallet** payments into SyncGaming for cosmetics purchases and premium features. Both payment methods are perfect for the Sri Lankan market.

---

## Why PayPal & Google Wallet?

### PayPal ✅
- Works globally including Sri Lanka
- Instant payouts
- Fraud protection
- Mobile-friendly
- No bank account needed (can use email)
- ~2.9% + $0.30 transaction fee

### Google Wallet ✅
- Fast payment processing
- Works on Android (95% of SL market)
- Stores payment methods securely
- Friction-free experience
- No additional app needed
- Competitive transaction fees

---

## Architecture Overview

```
User App
    │
    ├─ Cosmetics Store (Frontend)
    │
    ├─ "Buy with PayPal" ────→ PayPal Checkout
    │
    └─ "Buy with Google Wallet" ────→ Google Pay API
                                        │
                                        ├─ Processes Payment
                                        │
                                        └─ Returns Token
    │
    ├─ Backend API
    │  ├─ Validate Payment Token
    │  ├─ Create Payment Record
    │  └─ Add Cosmetic to User
    │
    └─ Firestore Database
       ├─ payments collection
       ├─ userCosmetics collection
       └─ transactionLogs collection
```

---

## Payment Flow Comparison

### PayPal Flow
```
1. User clicks "Buy with PayPal"
   ↓
2. Redirect to PayPal login
   ↓
3. User confirms payment
   ↓
4. PayPal redirects back to app with order ID
   ↓
5. Backend verifies with PayPal API
   ↓
6. If valid: Grant cosmetic, record transaction
   ↓
7. User sees confirmation
```

### Google Wallet Flow
```
1. User clicks "Buy with Google Wallet"
   ↓
2. Google Wallet processes payment
   ↓
3. App receives payment token
   ↓
4. Backend verifies with Google API
   ↓
5. If valid: Grant cosmetic, record transaction
   ↓
6. User sees confirmation
```

---

## Part 1: PayPal Integration

### Step 1: Setup PayPal Business Account

1. Go to [PayPal Developer](https://developer.paypal.com)
2. Sign in or create account
3. Create a new app:
   - Go to Apps & Credentials
   - Create App for Merchant Integration
   - Name: "SyncGaming"
4. Get your credentials:
   - Client ID (for frontend)
   - Secret (for backend - NEVER share!)

### Step 2: Install PayPal SDK

```bash
npm install @paypal/checkout-server-sdk
npm install @paypal/paypalrestsdk
```

### Step 3: Frontend - Add PayPal Button

Create `src/components/PaymentModal.js`:

```javascript
import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function PaymentModal({ cosmetic, onClose, onSuccess }) {
  const paypalClientId = process.env.REACT_APP_PAYPAL_CLIENT_ID;

  useEffect(() => {
    // Load PayPal script dynamically
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=USD`;
    script.async = true;
    script.onload = () => {
      if (window.paypal) {
        window.paypal.Buttons({
          createOrder: async (data, actions) => {
            // Create order on PayPal
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: (cosmetic.price / 100).toString(), // Convert cents to dollars
                  },
                  description: cosmetic.name,
                  custom_id: cosmetic.id,
                },
              ],
              intent: 'CAPTURE',
            });
          },
          onApprove: async (data, actions) => {
            // Capture the order
            const order = await actions.order.capture();
            
            // Send to backend for verification
            const response = await fetch('/api/payments/paypal/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await getUserToken()}`,
              },
              body: JSON.stringify({
                orderID: data.orderID,
                cosmeticId: cosmetic.id,
              }),
            });

            if (response.ok) {
              onSuccess();
              onClose();
            }
          },
          onError: (err) => {
            console.error('PayPal error:', err);
            alert('Payment failed. Please try again.');
          },
        }).render('#paypal-button-container');
      }
    };
    document.body.appendChild(script);
  }, [cosmetic, onClose, onSuccess, paypalClientId]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="modal-overlay"
    >
      <div className="modal-content bg-gray-800 p-6 rounded-lg max-w-md">
        <h2 className="text-2xl font-bold mb-4">{cosmetic.name}</h2>
        <p className="text-gray-400 mb-4">${(cosmetic.price / 100).toFixed(2)}</p>
        
        <div id="paypal-button-container" className="mb-4"></div>
        
        <button
          onClick={onClose}
          className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
}

async function getUserToken() {
  const user = await import('firebase/auth').then(m => m.getAuth().currentUser);
  return await user.getIdToken();
}
```

### Step 4: Backend - PayPal Verification

Add to `backend/routes/subscription.js`:

```javascript
const paypal = require('@paypal/checkout-server-sdk');

// Setup PayPal client
function client() {
  return new paypal.core.PayPalHttpClient(
    new paypal.core.SandboxEnvironment(
      process.env.PAYPAL_CLIENT_ID,
      process.env.PAYPAL_SECRET
    )
  );
}

// Verify PayPal payment
router.post('/api/payments/paypal/verify', verifyToken, async (req, res) => {
  try {
    const { orderID, cosmeticId } = req.body;
    const userId = req.user.uid;

    if (!orderID || !cosmeticId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify order with PayPal
    const request = new paypal.orders.OrdersGetRequest(orderID);
    const order = await client().execute(request);

    if (order.result.status !== 'COMPLETED') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    // Get cosmetic details
    const cosmeticRef = db.collection('cosmetics').doc(cosmeticId);
    const cosmeticSnap = await cosmeticRef.get();

    if (!cosmeticSnap.exists) {
      return res.status(404).json({ error: 'Cosmetic not found' });
    }

    const cosmetic = cosmeticSnap.data();

    // Verify amount matches
    const paymentAmount = order.result.purchase_units[0].amount.value;
    const expectedAmount = (cosmetic.price / 100).toFixed(2);

    if (paymentAmount !== expectedAmount) {
      return res.status(400).json({ error: 'Amount mismatch' });
    }

    // Record transaction
    await db.collection('transactions').add({
      userId,
      type: 'paypal',
      paypalOrderId: orderID,
      cosmeticId,
      amount: cosmetic.price,
      currency: 'USD',
      status: 'completed',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Add cosmetic to user
    const userRef = db.collection('users').doc(userId);
    await userRef.update({
      'subscription.rewards.cosmetics': admin.firestore.FieldValue.arrayUnion({
        cosmeticId,
        name: cosmetic.name,
        purchasedAt: admin.firestore.FieldValue.serverTimestamp(),
        paymentMethod: 'paypal',
      }),
    });

    res.json({ success: true, message: 'Cosmetic purchased successfully' });
  } catch (error) {
    console.error('PayPal verification error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});
```

### Step 5: Environment Variables for PayPal

Add to `.env`:
```bash
# PayPal
REACT_APP_PAYPAL_CLIENT_ID=YOUR_PAYPAL_CLIENT_ID
PAYPAL_CLIENT_ID=YOUR_PAYPAL_CLIENT_ID
PAYPAL_SECRET=YOUR_PAYPAL_SECRET
```

Add to `backend/.env`:
```bash
PAYPAL_CLIENT_ID=YOUR_PAYPAL_CLIENT_ID
PAYPAL_SECRET=YOUR_PAYPAL_SECRET
PAYPAL_MODE=sandbox  # Use 'live' in production
```

---

## Part 2: Google Wallet Integration

### Step 1: Setup Google Pay

1. Go to [Google Play Console](https://play.google.com/console)
2. Create/select your app
3. Go to Setup → App Integrity
4. Get your app signing certificate SHA-1
5. Go to [Google Pay API Setup](https://developers.google.com/pay/api/android/guides/setup)

### Step 2: Install Google Pay Library

```bash
npm install @google-pay/button-react
# OR for web:
npm install @google-pay/button
```

### Step 3: Frontend - Add Google Pay Button

Create `src/components/GooglePayButton.js`:

```javascript
import { useEffect } from 'react';

export default function GooglePayButton({ cosmetic, onSuccess, onError }) {
  const merchantId = process.env.REACT_APP_GOOGLE_MERCHANT_ID;

  useEffect(() => {
    // Load Google Pay script
    const script = document.createElement('script');
    script.src = 'https://pay.google.com/gp/p/js/pay.js';
    script.async = true;
    script.onload = initializeGooglePay;
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const initializeGooglePay = async () => {
    const paymentsClient = new window.google.payments.api.PaymentsClient({
      environment: 'PRODUCTION', // Use SANDBOX for testing
    });

    const isReadyToPayRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [
        {
          type: 'CARD',
          parameters: {
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks: ['MASTERCARD', 'VISA'],
          },
          tokenizationSpecification: {
            type: 'PAYMENT_GATEWAY',
            parameters: {
              gateway: 'stripe', // Or your payment gateway
              gatewayMerchantId: process.env.REACT_APP_STRIPE_MERCHANT_ID,
            },
          },
        },
      ],
    };

    try {
      const isReadyToPay = await paymentsClient.isReadyToPay(isReadyToPayRequest);
      if (isReadyToPay.result) {
        createAndShowButton(paymentsClient);
      }
    } catch (error) {
      console.error('Google Pay error:', error);
    }
  };

  const createAndShowButton = (paymentsClient) => {
    const button = document.createElement('button');
    button.id = 'google-pay-button';
    button.innerHTML = getGooglePayButtonHTML();
    button.onclick = async () => {
      try {
        const paymentData = await requestPayment(paymentsClient);
        await processGooglePayment(paymentData);
      } catch (error) {
        console.error('Error processing Google Pay:', error);
        onError?.(error);
      }
    };

    const container = document.getElementById('google-pay-button-container');
    if (container) {
      container.innerHTML = '';
      container.appendChild(button);
    }
  };

  const requestPayment = async (paymentsClient) => {
    const paymentDataRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
      merchantInfo: {
        merchantId: merchantId,
        merchantName: 'SyncGaming',
      },
      allowedPaymentMethods: [
        {
          type: 'CARD',
          parameters: {
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks: ['MASTERCARD', 'VISA'],
          },
          tokenizationSpecification: {
            type: 'PAYMENT_GATEWAY',
            parameters: {
              gateway: 'stripe',
              gatewayMerchantId: process.env.REACT_APP_STRIPE_MERCHANT_ID,
            },
          },
        },
      ],
      transactionInfo: {
        totalPriceStatus: 'FINAL',
        totalPrice: (cosmetic.price / 100).toString(),
        currencyCode: 'USD',
      },
    };

    return await paymentsClient.loadPaymentData(paymentDataRequest);
  };

  const processGooglePayment = async (paymentData) => {
    const token = await import('firebase/auth')
      .then(m => m.getAuth().currentUser.getIdToken());

    const response = await fetch('/api/payments/google-pay/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        paymentToken: paymentData.paymentMethodData.tokenizationData.token,
        cosmeticId: cosmetic.id,
        amount: cosmetic.price,
      }),
    });

    if (response.ok) {
      onSuccess?.();
    } else {
      throw new Error('Payment verification failed');
    }
  };

  const getGooglePayButtonHTML = () => {
    return `
      <svg class="google-pay-button-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-size="14" font-weight="500" fill="white">
          Google Pay
        </text>
      </svg>
    `;
  };

  return (
    <div className="google-pay-container">
      <div id="google-pay-button-container"></div>
    </div>
  );
}
```

### Step 4: Backend - Google Pay Verification

Add to `backend/routes/subscription.js`:

```javascript
// Verify Google Pay payment
router.post('/api/payments/google-pay/verify', verifyToken, async (req, res) => {
  try {
    const { paymentToken, cosmeticId, amount } = req.body;
    const userId = req.user.uid;

    if (!paymentToken || !cosmeticId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify token with your payment processor (Stripe, etc)
    // This is an example with Stripe
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    // You'll need to process the token through your payment gateway
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      payment_method_data: {
        type: 'card',
        card: {
          token: paymentToken,
        },
      },
      confirm: true,
    });

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment failed' });
    }

    // Get cosmetic details
    const cosmeticRef = db.collection('cosmetics').doc(cosmeticId);
    const cosmeticSnap = await cosmeticRef.get();

    if (!cosmeticSnap.exists) {
      return res.status(404).json({ error: 'Cosmetic not found' });
    }

    const cosmetic = cosmeticSnap.data();

    // Record transaction
    await db.collection('transactions').add({
      userId,
      type: 'google_pay',
      stripePaymentId: paymentIntent.id,
      cosmeticId,
      amount: cosmetic.price,
      currency: 'USD',
      status: 'completed',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Add cosmetic to user
    const userRef = db.collection('users').doc(userId);
    await userRef.update({
      'subscription.rewards.cosmetics': admin.firestore.FieldValue.arrayUnion({
        cosmeticId,
        name: cosmetic.name,
        purchasedAt: admin.firestore.FieldValue.serverTimestamp(),
        paymentMethod: 'google_pay',
      }),
    });

    res.json({ success: true, message: 'Cosmetic purchased successfully' });
  } catch (error) {
    console.error('Google Pay verification error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});
```

---

## Part 3: Cosmetics Store Component

Create `src/components/CosmeticsStore.js`:

```javascript
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useSubscription } from '../context/SubscriptionContext';
import PaymentModal from './PaymentModal';
import GooglePayButton from './GooglePayButton';

export default function CosmeticsStore() {
  const [cosmetics, setCosmetics] = useState([]);
  const [selectedCosmetic, setSelectedCosmetic] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const { user } = useSubscription();

  useEffect(() => {
    fetchCosmetics();
  }, []);

  const fetchCosmetics = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'cosmetics'));
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCosmetics(items);
    } catch (error) {
      console.error('Error fetching cosmetics:', error);
    }
  };

  const handlePaymentSuccess = async () => {
    setSelectedCosmetic(null);
    setPaymentMethod(null);
    // Refresh user data to show new cosmetic
    window.location.reload();
  };

  return (
    <div className="cosmetics-store p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Cosmetics Store</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cosmetics.map((cosmetic) => (
          <motion.div
            key={cosmetic.id}
            whileHover={{ y: -10 }}
            className="bg-gray-800 rounded-lg p-6 cursor-pointer"
            onClick={() => setSelectedCosmetic(cosmetic)}
          >
            <img
              src={cosmetic.image}
              alt={cosmetic.name}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h3 className="text-xl font-bold mb-2">{cosmetic.name}</h3>
            <p className="text-gray-400 mb-4">{cosmetic.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-green-400">
                ${(cosmetic.price / 100).toFixed(2)}
              </span>
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
                Buy
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedCosmetic && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800 p-8 rounded-lg max-w-md w-full mx-4"
          >
            <h2 className="text-2xl font-bold mb-4">{selectedCosmetic.name}</h2>
            <p className="text-gray-400 mb-6">${(selectedCosmetic.price / 100).toFixed(2)}</p>

            {!paymentMethod ? (
              <div className="space-y-3">
                <button
                  onClick={() => setPaymentMethod('paypal')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-bold"
                >
                  Pay with PayPal
                </button>
                <button
                  onClick={() => setPaymentMethod('google-pay')}
                  className="w-full bg-blue-400 hover:bg-blue-500 text-white py-3 rounded font-bold"
                >
                  Pay with Google Pay
                </button>
                <button
                  onClick={() => setSelectedCosmetic(null)}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded"
                >
                  Cancel
                </button>
              </div>
            ) : paymentMethod === 'paypal' ? (
              <PaymentModal
                cosmetic={selectedCosmetic}
                onClose={() => {
                  setSelectedCosmetic(null);
                  setPaymentMethod(null);
                }}
                onSuccess={handlePaymentSuccess}
              />
            ) : (
              <GooglePayButton
                cosmetic={selectedCosmetic}
                onSuccess={handlePaymentSuccess}
                onError={() => setPaymentMethod(null)}
              />
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
```

---

## Part 4: Database Schema

Update Firestore with new collections:

### `cosmetics` Collection
```javascript
{
  id: "avatar_premium_1",
  name: "Premium Avatar Pack",
  description: "Exclusive premium avatars",
  image: "url_to_image",
  price: 299, // in cents (USD 2.99)
  category: "avatar",
  rarity: "rare",
  available: true
}
```

### `transactions` Collection
```javascript
{
  userId: "user123",
  type: "paypal" | "google_pay",
  paypalOrderId: "order_id" (if PayPal),
  stripePaymentId: "charge_id" (if Google Pay),
  cosmeticId: "avatar_premium_1",
  amount: 299,
  currency: "USD",
  status: "completed" | "failed" | "pending",
  timestamp: timestamp,
  metadata: {
    ipAddress: "...",
    userAgent: "..."
  }
}
```

---

## Firestore Security Rules Update

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Cosmetics are public read
    match /cosmetics/{cosmeticId} {
      allow read: if true;
      allow write: if request.auth.token.admin == true;
    }

    // Transactions - user can read own, admin can read all
    match /transactions/{transactionId} {
      allow read: if request.auth.uid == resource.data.userId ||
                      request.auth.token.admin == true;
      allow create: if request.auth != null;
      allow write: if request.auth.token.admin == true;
    }

    // Users can update own cosmetics
    match /users/{userId} {
      allow update: if request.auth.uid == userId;
      allow read: if request.auth != null;
    }
  }
}
```

---

## Environment Variables Checklist

### Frontend `.env`
```bash
REACT_APP_PAYPAL_CLIENT_ID=YOUR_CLIENT_ID
REACT_APP_GOOGLE_MERCHANT_ID=YOUR_MERCHANT_ID
REACT_APP_STRIPE_MERCHANT_ID=YOUR_STRIPE_KEY
```

### Backend `.env`
```bash
PAYPAL_CLIENT_ID=YOUR_CLIENT_ID
PAYPAL_SECRET=YOUR_SECRET
PAYPAL_MODE=sandbox  # or 'live'
STRIPE_SECRET_KEY=YOUR_SECRET_KEY
GOOGLE_MERCHANT_ACCOUNT_ID=YOUR_ACCOUNT_ID
```

---

## Implementation Checklist

- [ ] Setup PayPal Developer Account
- [ ] Setup Google Pay API
- [ ] Install npm packages (paypal-sdk, etc)
- [ ] Create PaymentModal component
- [ ] Create GooglePayButton component
- [ ] Create CosmeticsStore component
- [ ] Add backend PayPal routes
- [ ] Add backend Google Pay routes
- [ ] Update Firestore schema
- [ ] Update security rules
- [ ] Create environment variables
- [ ] Test with sandbox/test accounts
- [ ] Deploy to production

---

## Testing

### PayPal Testing
1. Use Sandbox credentials
2. Test with PayPal's test accounts
3. Check transaction logs in PayPal Dashboard

### Google Pay Testing
1. Use test mode environment
2. Test with various card types
3. Check transactions in Stripe Dashboard (if using Stripe)

---

## Fees Breakdown

| Method | Transaction Fee | Settlement | Best For |
|--------|-----------------|-----------|----------|
| PayPal | 2.9% + $0.30 | 1-2 days | Global payments |
| Google Pay (via Stripe) | 2.9% + $0.30 | 2-3 days | Mobile users |

---

## Security Considerations

✅ Never expose API secrets
✅ Always verify on backend
✅ Use HTTPS in production
✅ Implement rate limiting
✅ Add fraud detection
✅ Log all transactions
✅ Regular security audits

---

## Support & Resources

- [PayPal Developer Docs](https://developer.paypal.com/docs)
- [Google Pay Setup Guide](https://developers.google.com/pay/api)
- [Stripe Documentation](https://stripe.com/docs)
- [Firebase Security](https://firebase.google.com/docs/firestore/security)

---

Next: Follow the step-by-step integration in the next section!
