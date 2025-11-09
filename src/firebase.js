// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDOpen0yRQdCevEDoWFUph7Hc1zuDawsrc",
  authDomain: "gen-lang-client-0350765152.firebaseapp.com",
  projectId: "gen-lang-client-0350765152",
  storageBucket: "gen-lang-client-0350765152.firebasestorage.app",
  messagingSenderId: "282879637359",
  appId: "1:282879637359:web:f522929679da9310141a9a",
  measurementId: "G-1ZVQHWE162"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { app, storage, db, analytics };