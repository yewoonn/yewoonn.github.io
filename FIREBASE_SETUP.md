# Private Analytics — Setup Guide

A private, URL-only analytics page that tracks **daily visits**, **visitor location
(country / city)**, and the **entry section** each visitor lands on. Data is stored in
**Firebase Firestore**.

- Public site logs a visit on each page load → Firestore `visits` collection.
- Your private dashboard reads and aggregates that data.
- The dashboard is hidden behind a secret URL: **`/#<VITE_ADMIN_SLUG>`**
  (default `#admin-b15baa82ee` — change it).

---

## 1. Create a Firebase project

1. Go to <https://console.firebase.google.com> → **Add project** (any name).
2. In the project, open **Build → Firestore Database → Create database**.
   - Start in **production mode** (we set explicit rules below).
   - Pick a location (e.g. `asia-northeast3` for Seoul).

## 2. Register a Web app & copy the config

1. Project Overview → **Add app → Web (`</>`)** → give it a nickname → Register.
2. Copy the `firebaseConfig` values shown.
3. Paste them into **`.env.local`** in this project:

   ```
   VITE_FIREBASE_API_KEY=AIza...
   VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-app
   VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
   VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef
   VITE_ADMIN_SLUG=admin-b15baa82ee   # change to your own secret
   ```

4. **Restart the dev server** (`npm run dev`) so Vite picks up the new env vars.

## 3. Publish the security rules

Firestore Database → **Rules** tab → replace everything with the contents of
[`firestore.rules`](./firestore.rules) → **Publish**.

These rules let any visitor *create* a visit (with a strict field whitelist, no edits/deletes)
and allow *reads* so the dashboard works.

## 4. Use it

- Visit the site normally — each load records a visit.
- Open your private dashboard at:  **`https://<your-site>/#admin-b15baa82ee`**
  (or `http://localhost:5173/#admin-b15baa82ee` in dev).

---

## ⚠️ Security note (important)

You chose **URL-only** protection (no login). That hides the *page*, but because the
dashboard reads Firestore without authenticating, the read rule is `allow read: if true`.
**Anyone who discovers your Firebase project id could read the visit data.** It is obscurity,
not real access control.

**To make it genuinely private**, switch to Google login:
1. Firebase Console → **Authentication → Sign-in method → Google → Enable**.
2. Ask Claude to "add Google login to the admin page", and
3. In `firestore.rules`, replace `allow read: if true;` with the email-restricted rule
   already written in the comment there.

## Notes

- Location comes from a free IP lookup (`ipwho.is`, HTTPS, no key, ~10k/month).
- "Unique visitors" uses a random id saved in the browser's `localStorage`.
- Daily buckets use **Asia/Seoul** time.
- `.env.local` is gitignored so your config never gets committed.
