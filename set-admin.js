// Quick script to set a user as admin
const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, 'backend', 'serviceAccountKey.json');
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://gen-lang-client-0350765152.firebaseio.com'
});

const db = admin.firestore();

// UID to promote
const uidToPromote = '8kldh6A3ZcdRQez7AwqnfkH4PeL2';

async function setAdmin() {
  try {
    console.log(`Setting user ${uidToPromote} as admin...`);
    
    // Set custom claim
    await admin.auth().setCustomUserClaims(uidToPromote, { admin: true });
    console.log(`✅ Custom claim set successfully!`);
    
    // Log to Firestore (optional)
    try {
      await db.collection('adminAuditLog').add({
        action: 'set-admin',
        targetUserId: uidToPromote,
        timestamp: new Date(),
        performedBy: 'system-script'
      });
      console.log(`✅ Audit log created!`);
    } catch (firestoreError) {
      console.log(`⚠️  Audit log skipped (Firestore not enabled - that's OK)`);
    }
    
    console.log('\n✨ User is now an admin!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setAdmin();
