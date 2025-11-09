# Firestore Security Rules Deployment Guide

## Overview
This guide will walk you through deploying the Firestore security rules for the leaderboard, analytics, and sponsored games features.

## Rules to Deploy

Copy and paste these rules into your Firestore Security Rules console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check admin claims
    function isAdmin() {
      return request.auth.token.admin == true;
    }

    // Helper function to get current user ID
    function currentUserId() {
      return request.auth.uid;
    }

    // ============================================
    // LEADERBOARD COLLECTION RULES
    // ============================================
    match /leaderboard/{gameId}/scores/{scoreId} {
      // Public Read - Anyone can view leaderboard
      allow read: if true;

      // Authenticated Write - Only authenticated users can submit scores
      // The score must be for their own user
      allow create: if request.auth != null 
                       && request.auth.uid == request.resource.data.userId;

      // Admin can delete scores (for moderation)
      allow delete: if isAdmin();

      // No updates allowed (immutable scores)
      allow update: if false;
    }

    // ============================================
    // USER ANALYTICS COLLECTION RULES
    // ============================================
    match /userAnalytics/{userId} {
      // Users can read their own analytics or admins can read any
      allow read: if request.auth != null 
                     && (currentUserId() == userId || isAdmin());

      // Users can only write to their own analytics
      allow write: if request.auth != null && currentUserId() == userId;

      // Admins can delete (for cleanup)
      allow delete: if isAdmin();
    }

    // ============================================
    // GAME ANALYTICS COLLECTION RULES
    // ============================================
    match /gameAnalytics/{gameId} {
      // Only admins can read game analytics
      allow read: if request.auth != null && isAdmin();

      // No one can write directly (backend manages this)
      allow write: if false;

      // Admins can delete (for cleanup)
      allow delete: if isAdmin();
    }

    // ============================================
    // GAMES COLLECTION (Original)
    // ============================================
    // (Keep existing rules if you have them)
    match /games/{gameId} {
      // Public read
      allow read: if true;
      // Admin write
      allow write: if request.auth != null && isAdmin();
    }

    // ============================================
    // USERS COLLECTION (If exists)
    // ============================================
    match /users/{userId} {
      allow read: if request.auth != null 
                     && (currentUserId() == userId || isAdmin());
      allow write: if request.auth != null && currentUserId() == userId;
    }
  }
}
```

## Step-by-Step Deployment

### 1. **Access Firestore Console**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your SyncGaming project
   - Click on "Firestore Database" in the left menu

### 2. **Navigate to Rules Tab**
   - In the Firestore Database page, click on the "Rules" tab at the top
   - You should see the current rules (likely with default restrictive rules)

### 3. **Copy and Paste New Rules**
   - Click the "Edit Rules" button
   - Clear all existing rules
   - Copy the complete rules above and paste them in

### 4. **Review Changes**
   - Review the rules to ensure they match the requirements:
     - Leaderboards are publicly readable
     - Users can submit their own scores
     - User analytics are private or admin-visible
     - Game analytics are admin-only
   - Check for any syntax errors (the editor will highlight them)

### 5. **Publish Rules**
   - Click the "Publish" button
   - Firebase will validate the rules
   - You'll see a confirmation message when deployed

### 6. **Verify Deployment**
   - The rules page should now show "Last updated: [timestamp]"
   - Test by trying to read/write data from your app

## Testing the Rules

### Test Leaderboard Read (Public)
```javascript
// This should work without authentication
const leaderboardRef = db.collection('leaderboard').doc('snake-game').collection('scores');
const snapshot = await leaderboardRef.limit(10).get();
console.log(snapshot.docs.length); // Should return scores
```

### Test Score Submission (Authenticated)
```javascript
// This should work for authenticated users
const user = auth.currentUser;
const token = await user.getIdToken();

fetch('${API_URL}/scores/submit', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    gameId: 'snake-game',
    score: 150,
    duration: 45
  })
});
// Should return success
```

### Test User Analytics Read (Own Data)
```javascript
// This should work for the current user viewing their own data
const userId = auth.currentUser.uid;
const analyticsRef = db.collection('userAnalytics').doc(userId);
const snapshot = await analyticsRef.get();
console.log(snapshot.data()); // Should return user's analytics
```

### Test Game Analytics Read (Admin Only)
```javascript
// This should work only for admins
const gameAnalyticsRef = db.collection('gameAnalytics').doc('snake-game');
const snapshot = await gameAnalyticsRef.get();
// If user is not admin: "PERMISSION_DENIED"
// If user is admin: returns game analytics
```

## Troubleshooting

### Issue: "PERMISSION_DENIED" when submitting scores
**Solution**: 
- Verify user is authenticated
- Verify user's UUID matches the `userId` in the request
- Check that `request.auth != null` in your app

### Issue: Leaderboard shows nothing
**Solution**:
- Verify leaderboard collection exists and has documents
- Check that `allow read: if true` is in the rules
- Verify the gameId is correct

### Issue: Admin can't access game analytics
**Solution**:
- Verify user has `admin == true` claim in Firebase
- Check that `/analytics/game/:gameId` endpoint verifies admin
- Verify rules have `allow read: if isAdmin()`

### Issue: Users can see other users' analytics
**Solution**:
- Verify rules restrict to: `currentUserId() == userId || isAdmin()`
- Check backend also validates access control

## Rollback Plan

If something breaks after deploying new rules:

1. Go to Firestore Rules tab
2. Click "Edit Rules"
3. Click "View History" button (top right)
4. Select the previous version
5. Click "Restore This Version"
6. Click "Publish"

The system will revert to the previous rules.

## Security Checklist

- ✅ Leaderboards are public readable (for engagement)
- ✅ Scores can only be created by authenticated users
- ✅ Users can't modify their scores (no update allowed)
- ✅ User analytics are private (only self + admins)
- ✅ Game analytics are admin-only (for privacy)
- ✅ Admin functions are protected with `isAdmin()` check
- ✅ All sensitive data behind authentication
- ✅ No direct writes to analytics (backend only)

## Production Deployment

### Pre-Deployment Checklist
- [ ] Rules have been tested locally
- [ ] No sensitive data is exposed in leaderboards
- [ ] Admin verification is working
- [ ] Backend endpoints are validating requests
- [ ] Firebase authentication is enabled
- [ ] All admins have `admin == true` custom claim

### Deploy to Production
- [ ] Review rules one more time
- [ ] Deploy to Firebase console
- [ ] Monitor console logs for permission errors
- [ ] Test key flows in production
- [ ] Keep previous version readily accessible for rollback

## Questions?

Refer to:
- [Firestore Security Rules Documentation](https://firebase.google.com/docs/firestore/security/overview)
- [Firebase Custom Claims Documentation](https://firebase.google.com/docs/auth/admin-setup#set_custom_claims_on_a_user_account)
- The IMPLEMENTATION_COMPLETE.md for architecture details
