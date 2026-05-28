# Firebase setup (Google sign-in + sync)

## 1. Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. **Add project** → name it (e.g. `life-command-center`) → continue → create

## 2. Register a web app

1. Project overview → **Web** (`</>`)
2. App nickname: `Command Center`
3. Copy the `firebaseConfig` object

## 3. Paste config into this repo

Edit **`firebase-config.js`** in the project root and replace the placeholder values:

```javascript
window.FIREBASE_CONFIG = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

Commit and push so GitHub Pages serves the same config.

## 4. Enable Google sign-in

1. Firebase Console → **Build** → **Authentication** → **Get started**
2. **Sign-in method** → **Google** → Enable → Save
3. Set a support email if prompted

## 5. Create Firestore

1. **Build** → **Firestore Database** → **Create database**
2. Start in **production mode** (you’ll paste rules next)
3. Pick a region close to you (e.g. `us-east1`)

## 6. Firestore security rules

1. Firestore → **Rules**
2. Paste the contents of **`firestore.rules`** from this repo (only the signed-in user can read/write their own doc)
3. **Publish**

## 7. Authorized domains (required for GitHub Pages + phone)

1. **Authentication** → **Settings** → **Authorized domains**
2. Ensure these exist (add if missing):
   - `localhost`
   - `YOUR_GITHUB_USERNAME.github.io`
   - Your Firebase domains (`PROJECT_ID.firebaseapp.com`, etc.)

## 8. Test locally

```bash
cd ~/Desktop/Scheduler
python3 -m http.server 8765
```

Open `http://localhost:8765/life-dashboard.html` → **Sign in with Google** → change something → refresh → data should persist.

Sign in on a second browser (or phone) with the **same Google account** — data should match.

## How sync works

- Data is stored in Firestore: `users/{your-uid}` with field `data` (full dashboard JSON).
- Each save updates localStorage immediately, then syncs to cloud ~600ms later.
- On sign-in: cloud data wins if it’s newer; if cloud is empty, your local Mac data is uploaded once.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| “Local only — add firebase-config.js” | Fill in `firebase-config.js` (not placeholders) |
| Popup blocked on phone | App falls back to redirect sign-in automatically |
| `auth/unauthorized-domain` | Add your `*.github.io` domain in Authorized domains |
| Permission denied in Firestore | Publish `firestore.rules` from this repo |
