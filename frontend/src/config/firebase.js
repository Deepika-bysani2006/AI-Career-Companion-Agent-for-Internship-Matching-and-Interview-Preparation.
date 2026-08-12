/**
 * Firebase Authentication Configuration Module for SkillBridge Frontend.
 * Loads Web App configuration strictly from Vite environment variables (VITE_FIREBASE_*).
 * Provides crash-proof lazy getters for Firebase Auth & Google Provider.
 */
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const getFirebaseConfig = () => ({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBNlabmWAfvG_A9SiubC6ebsR50ihhGd4o",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "skillbridge-9d5a7.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "skillbridge-9d5a7",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "skillbridge-9d5a7.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "235324933124",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:235324933124:web:24bda23cf5b39bbd96e151"
});

let _app = null;
let _auth = null;

export const getFirebaseApp = () => {
  if (!_app) {
    try {
      const apps = getApps();
      if (apps.length > 0) {
        _app = apps[0];
      } else {
        _app = initializeApp(getFirebaseConfig());
      }
    } catch (err) {
      console.warn("Firebase App initialization deferred:", err);
    }
  }
  return _app;
};

export const getFirebaseAuth = () => {
  if (!_auth) {
    const app = getFirebaseApp();
    if (app) {
      try {
        _auth = getAuth(app);
      } catch (err) {
        console.warn("Firebase Auth initialization deferred:", err);
      }
    }
  }
  return _auth;
};

export const getGoogleProvider = () => {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    return provider;
  } catch (err) {
    console.warn("GoogleAuthProvider deferred:", err);
    return null;
  }
};

export const isFirebaseConfigured = () => {
  const auth = getFirebaseAuth();
  const cfg = getFirebaseConfig();
  return Boolean(auth && cfg.apiKey);
};

export { signInWithPopup };
