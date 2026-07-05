import { initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore/lite";

// Firebase config is read from environment variables (.env.local for dev, .env.production for build).
// These values are NOT secret — they ship in the client bundle by design.
// What actually protects your data is Firestore Security Rules (see firestore.rules) + Google login.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Only this Google account may view the analytics dashboard.
// MUST match the `allow read` email in firestore.rules and the account you sign in with.
export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "yewoonn02@gmail.com";

// If Firebase isn't configured yet, the site still works — tracking simply no-ops
// and the admin page shows a "configure Firebase" message.
export const firebaseEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

// `app` is exported so the (lazy-loaded) admin page can init firebase/auth on demand,
// keeping the auth SDK out of the main bundle that normal visitors download.
export const app: FirebaseApp | null = firebaseEnabled ? initializeApp(firebaseConfig) : null;
export const db: Firestore | null = app ? getFirestore(app) : null;
