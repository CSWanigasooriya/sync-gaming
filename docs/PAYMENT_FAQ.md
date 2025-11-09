# PayPal & Google Wallet - FAQ & Common Issues

## 🎯 General Questions

### Q: Why PayPal and Google Pay?
**A:** Perfect for Sri Lanka market:
- **PayPal**: Works globally, no bank account needed
- **Google Pay**: 95% of SL users are on Android
- Both are trusted, secure, and instant

### Q: What about other payment methods?
**A:** You can add more later:
- Stripe (cards)
- Apple Pay (iOS)
- Local wallets (if needed)
- Airtime/mCash (special SL partnerships)

### Q: Will PayPal/Google Pay work in Sri Lanka?
**A:** YES! Both fully support SL:
- PayPal: Available for businesses
- Google Pay: Full Android support
- Users don't need to be in US to use them

### Q: How much does it cost?
**A:** 
- PayPal: 2.9% + $0.30 per transaction
- Google Pay: 2.9% + $0.30 (via Stripe)
- No setup fees, pay only per transaction

### Q: How long until I get paid?
**A:**
- PayPal: 1-2 business days
- Google Pay (Stripe): 2-3 business days
- Direct to your bank account

---

## 🔧 Setup Questions

### Q: I'm stuck getting PayPal credentials. Help?
**A:** Follow this exactly:
1. Go to https://developer.paypal.com
2. Click "Sign in" (top right)
3. Use your email/password
4. Click "Apps & Credentials" (sidebar)
5. Make sure you're in SANDBOX mode (dropdown)
6. Copy the Client ID (long string)
7. You got it!

For production:
- Switch to LIVE mode
- Get live credentials
- Replace in .env

### Q: Where is Google Merchant ID?
**A:**
1. Go to https://developers.google.com/pay/api
2. Click "Get Started"
3. Login with Google account
4. Follow setup wizard
5. Create Merchant Account (or use existing)
6. Your Merchant ID will be shown
7. Copy and add to .env

### Q: Do I need a Stripe account?
**A:** YES, for Google Pay processing:
1. Go to https://stripe.com
2. Click "Start now"
3. Enter email and password
4. Verify email
5. Get API keys (test first, then live)
6. Add to .env

### Q: What's the difference between Sandbox and Live?
**A:**
- **Sandbox**: Testing mode, no real charges
- **Live**: Real money, real charges
- Start with sandbox, switch to live later

### Q: How do I test without real money?
**A:** Use PayPal sandbox:
1. In developer dashboard, create test accounts
2. Merchant account (for you)
3. Buyer account (for testing)
4. Make test payments
5. No real charges!

---

## 💻 Backend Questions

### Q: I added the payment route but it's not working
**A:** Check:
1. Correct import: `const paymentRoutes = require('./routes/payments');`
2. Added to app: `app.use(paymentRoutes);`
3. Restarted backend: `npm run dev`
4. Check console for errors
5. Test endpoint: `curl http://localhost:5000/api/payments/...`

### Q: How do I test the backend?
**A:** Use curl or Postman:
```bash
# Create order
curl -X POST http://localhost:5000/api/payments/paypal/create-order \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"cosmeticId":"avatar_1"}'

# Verify payment
curl -X POST http://localhost:5000/api/payments/paypal/verify \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"orderID":"ORDER_123","cosmeticId":"avatar_1"}'
```

### Q: Transactions not being recorded
**A:** Check:
1. Firestore `transactions` collection exists
2. Backend is writing successfully
3. Check Firebase Console for errors
4. Check backend logs for exceptions
5. Verify user UID is correct

### Q: User not getting cosmetic
**A:** Check:
1. Cosmetic exists in Firestore
2. Backend successfully updated user document
3. Check Firestore security rules allow update
4. Check user document structure
5. Verify `subscription.rewards.cosmetics` array exists

---

## 🎨 Frontend Questions

### Q: PayPal button not showing
**A:** Check:
1. `REACT_APP_PAYPAL_CLIENT_ID` in `.env`
2. Run `npm start` (env loaded on app start)
3. Check browser Network tab - script loaded?
4. Console errors? (F12 → Console)
5. Try different browser
6. Clear cache (hard refresh: Ctrl+Shift+R)

### Q: Google Pay button not showing
**A:** Check:
1. `REACT_APP_GOOGLE_MERCHANT_ID` in `.env`
2. Device supports Google Pay
3. Chrome browser (works best)
4. Valid merchant ID format
5. Script loaded in Network tab

### Q: Can't redirect to payment page
**A:** Check:
1. Backend running and accessible
2. CORS configured correctly
3. No console errors
4. Token valid
5. Backend endpoint responding

### Q: Payment modal won't close
**A:** Check:
1. `onClose` function passed correctly
2. State management (React)
3. Modal component displaying properly
4. Try hard refresh

---

## 🔐 Security Questions

### Q: Is it safe to put Client ID in frontend .env?
**A:** YES - Client ID is SAFE to expose:
- Client ID is public by design
- Used for frontend integration only
- NEVER expose Secret on frontend
- Secret stays on backend only

### Q: How do I keep Secret safe?
**A:** 
1. NEVER commit to git
2. ALWAYS use backend .env
3. Add .env to .gitignore
4. On production: use environment variables
5. Render/Railway will ask for env vars

### Q: What if someone steals my credentials?
**A:**
1. Immediately regenerate in PayPal/Google
2. Update .env files
3. Redeploy backend
4. Check for fraudulent transactions
5. Contact PayPal/Google support

### Q: How do I prevent fraud?
**A:**
1. Always verify on backend
2. Check amount matches
3. Check for duplicate purchases
4. Log IP addresses
5. Monitor for unusual patterns
6. Add rate limiting
7. Implement CAPTCHA if needed

---

## 💰 Revenue Questions

### Q: How much will I make?
**A:** Depends on:
- User base size
- Conversion rate (typically 5-15%)
- Average cosmetic price
- Formula: Users × Conversion% × Avg Price - Fees

**Example:**
```
1000 users × 10% conversion × $2.99 avg = $299/month
- 2.9% fee ($8.67)
- $0.30 per transaction ($3 for 10 purchases)
= ~$287/month net
```

### Q: How do I increase revenue?
**A:**
1. More cosmetics (variety)
2. Limited-time offers
3. Bundle deals
4. Premium cosmetics
5. Seasonal items
6. Battle passes
7. VIP cosmetics
8. Grow user base (most important)

### Q: When do I get paid?
**A:**
- Payouts are automatic
- Daily/Weekly depending on setting
- PayPal: Typically 1-2 business days
- Stripe: Typically 2-3 business days
- Direct to your bank account

### Q: What about taxes?
**A:** You're responsible for:
1. Reporting income to tax authority
2. Possibly collecting VAT/GST
3. Business registration (check SL rules)
4. Consult accountant for specifics
5. Keep all transaction records

---

## 🐛 Common Bugs

### Bug: "Token expired"
**Fix:**
```javascript
// Refresh token before payment
const token = await user.getIdToken(true); // Force refresh
```

### Bug: "CORS error"
**Fix:** In backend server.js:
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'https://yourdomain.com'],
  credentials: true
}));
```

### Bug: "Payment not found"
**Fix:** Verify Firestore collections exist:
```javascript
// In Firebase Console:
1. Create "cosmetics" collection
2. Create "transactions" collection
3. Check security rules allow writes
```

### Bug: "Amount mismatch"
**Fix:** Ensure consistent formatting:
```javascript
// Prices in CENTS always
const price = 299;  // $2.99
const inDollars = (price / 100).toFixed(2);  // "2.99"
```

### Bug: "User document not found"
**Fix:** Ensure user document created on signup:
```javascript
// In auth flow, create user doc:
await db.collection('users').doc(userId).set({
  email,
  subscription: { /* ... */ },
  // other fields
}, { merge: true });
```

---

## 📊 Monitoring Questions

### Q: How do I track revenue?
**A:** Backend already includes:
```
GET /api/admin/payments/analytics
  → Total revenue
  → Transactions by method
  → Average order value
  → Top cosmetics
```

### Q: How do I check transaction history?
**A:**
- User: `GET /api/payments/transactions/history`
- Admin: `GET /api/admin/payments/all-transactions`

### Q: What should I monitor?
**A:**
- Daily revenue
- Payment success rate
- Failed transactions
- Refund rate
- Fraud attempts
- Popular cosmetics
- Conversion rate

---

## 🌍 International Questions

### Q: Works in countries other than Sri Lanka?
**A:** YES:
- PayPal: 200+ countries
- Google Pay: 40+ countries
- Automatically works globally
- Currency conversion handled by processor

### Q: Do I need different setup for different countries?
**A:** NO:
- Same setup works globally
- Currency auto-detected
- Tax might differ by country
- Payouts to your account

### Q: What about local currency?
**A:** 
- Currently set to USD
- Can add LKR support (need local processor)
- Conversion rates handled automatically

---

## 🆘 Still Have Issues?

### Debug Checklist
- [ ] Console has no errors (F12)
- [ ] Backend logs show requests (npm run dev)
- [ ] Firestore has data
- [ ] .env has correct values
- [ ] CORS configured
- [ ] Routes added to server.js
- [ ] Components imported correctly

### Getting Help
1. Check backend logs (terminal)
2. Check browser console (F12)
3. Check Firestore Console
4. Check network requests (F12 → Network)
5. Review the docs again
6. Try fresh browser session

---

## ✅ Checklist Before Launch

- [ ] PayPal account created
- [ ] Google Pay Merchant ID obtained
- [ ] Stripe account created (for Google Pay)
- [ ] All credentials in .env
- [ ] Backend payment routes working
- [ ] PayPal button displays
- [ ] Google Pay button displays
- [ ] Test payment works
- [ ] Transaction recorded in Firestore
- [ ] Cosmetic awarded to user
- [ ] Admin analytics show transaction
- [ ] Error handling works
- [ ] Mobile UI looks good
- [ ] Security rules configured
- [ ] Rate limiting enabled
- [ ] Fraud detection ready

---

## 🎉 Success! You're Ready!

If you've:
✅ Got credentials
✅ Added backend routes
✅ Created frontend components
✅ Tested locally
✅ Deployed to production

**You can now process real payments! 💰**

---

## 📞 Quick Reference

**PayPal Developer**: https://developer.paypal.com
**Google Pay**: https://developers.google.com/pay
**Stripe**: https://stripe.com
**Firebase Console**: https://console.firebase.google.com

---

**Questions? Check this FAQ first!**
