/**
 * Firebase Authentication Configuration Module for SkillBridge Frontend.
 * Loads Web App configuration strictly from Vite environment variables (VITE_FIREBASE_*).
 * Provides GoogleAuthProvider and signInWithPopup helper with crash-proof lazy initialization.
 */
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBNlabmWAfvG_A9SiubC6ebsR50ihhGd4o",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "skillbridge-9d5a7.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "skillbridge-9d5a7",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "skillbridge-9d5a7.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "235324933124",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:235324933124:web:24bda23cf5b39bbd96e151"
};

let app = null;
let auth = null;
let googleProvider = null;

try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: "select_account" });
} catch (err) {
  console.warn("Firebase initialization deferred:", err);
}

export const isFirebaseConfigured = () => {
  return Boolean(auth && firebaseConfig.apiKey);
};

export { app, auth, googleProvider, signInWithPopup };
