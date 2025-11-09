# Firebase Configuration - Fix CORS & Security Rules

## Problem Summary

You're seeing these errors:
- ❌ WebChannelConnection RPC 'Listen' errors
- ❌ Failed to load resources (400 errors)
- ❌ CORS policy blocking requests

These happen because:
1. Firestore security rules are blocking reads
2. Firebase Storage CORS not configured
3. Default Firebase rules are too restrictive

## Solution Steps

### Step 1: Fix Firestore Security Rules (CRITICAL)

1. Open Firebase Console: https://console.firebase.google.com
2. Select your project: **gen-lang-client-0350765152**
3. Click **Firestore Database** in left sidebar
4. Click **Rules** tab
5. Replace everything with this:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to read games
    match /games/{gameId} {
      allow read: if true;
      allow write: if request.auth.uid != null && 
        request.auth.token.admin == true;
    }
    
    // Allow admins to access audit logs
    match /adminAuditLog/{document=**} {
      allow read: if request.auth.uid != null && 
        request.auth.token.admin == true;
      allow write: if false; // Only server can write
    }
    
    // Allow authenticated users to read/write their own data
    match /{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == resource.data.userId;
    }
  }
}
```

6. Click **Publish** button
7. Wait for "Rules updated successfully" message

### Step 2: Fix Firebase Storage CORS

1. From Firebase Console, click **Storage** in left sidebar
2. Click **Files** tab
3. Look for the storage bucket URL
4. Or run this command:

```bash
# Install Google Cloud SDK if you don't have it
# https://cloud.google.com/sdk/docs/install

# Then run:
gsutil cors set - gs://gen-lang-client-0350765152.appspot.com << 'EOF'
[
  {
    "origin": [
      "https://hilarious-crostata-bb59b0.netlify.app",
      "http://localhost:3000",
      "http://localhost:3000/"
    ],
    "method": [
      "GET",
      "HEAD",
      "DELETE"
    ],
    "responseHeader": [
      "Content-Type",
      "x-goog-meta-uploaded-content-length"
    ],
    "maxAgeSeconds": 3600
  }
]
EOF
```

### Step 3: Verify in Firebase Console

1. Go to Firestore Database
2. You should see no security warnings
3. Try accessing your app again
4. Errors should be gone! ✅

### Step 4: Test Your App

1. Go to: https://hilarious-crostata-bb59b0.netlify.app
2. Open DevTools (F12)
3. Go to Console tab
4. Sign in
5. Check if errors are gone

If you still see errors:
- Refresh the page (hard refresh: Ctrl+Shift+R)
- Clear browser cache
- Wait 5 minutes for Firebase rules to propagate
- Check Firebase Console for any warnings

## Quick Checklist

- [ ] Updated Firestore Rules
- [ ] Published the rules (wait for confirmation)
- [ ] Configured Storage CORS
- [ ] Hard refreshed browser (Ctrl+Shift+R)
- [ ] Checked console - no errors!

## If You Still Get Errors

Common causes:
1. **Rules not published yet** - Wait 5 minutes
2. **Cache not cleared** - Hard refresh with Ctrl+Shift+R
3. **Old tokens** - Sign out and sign back in
4. **Wrong bucket** - Check Storage bucket name matches

Need help? Check:
- Firebase Console → Firestore → Rules tab
- Firebase Console → Storage → Files
- Browser Console (F12) for specific error messages

---

**Your App URL**: https://hilarious-crostata-bb59b0.netlify.app  
**Firebase Project**: gen-lang-client-0350765152  
**Storage Bucket**: gen-lang-client-0350765152.appspot.com
