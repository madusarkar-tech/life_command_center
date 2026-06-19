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

## 3b. Web client ID (required for iPhone / GitHub Pages sign-in)

Redirect sign-in does **not** work on iPhone Safari when the app is hosted on `github.io`. The app uses Google Identity Services instead, which needs your **Web client ID**:

1. Firebase Console → **Authentication** → **Sign-in method** → **Google** → expand **Web SDK configuration**
2. Copy **Web client ID** (ends in `.apps.googleusercontent.com`)
3. Add to **`firebase-config.js`**:

```javascript
window.FIREBASE_CONFIG = {
  apiKey: "...",
  authDomain: "...",
  // ...
  googleWebClientId: "93263530978-xxxxxxxx.apps.googleusercontent.com"
};
```

4. Commit and push. Also confirm **Google Cloud Console** → **Credentials** → that Web client → **Authorized JavaScript origins** includes `https://madusarkar-tech.github.io`

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

## 7. Authorized domains (required — fixes “requested action is invalid”)

1. **Authentication** → **Settings** → **Authorized domains**
2. Click **Add domain** and ensure ALL of these exist:
   - `localhost`
   - `127.0.0.1` (add manually if missing)
   - `YOUR_GITHUB_USERNAME.github.io` (for phone later)
3. Do **not** include `http://` or port numbers — only the hostname.

If sign-in still fails on your Mac, open the dashboard at exactly:

`http://localhost:8765/life-dashboard.html`

(not the Desktop `.app` file, not `file://`)

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
- Tab visibility and custom tabs sync via `data.tabUi` (`hiddenTabs`, `customTabs`) with `tabUiUpdatedAt` (last-write-wins across devices).
- Open-time slots in Today's bands sync via `dayConfig[date].periodOpenSlots` and `periodOpenSlotHidden` (per-field LWW like other band fields).
- Life Plan phases and default templates sync via `data.lifePlan` with `lifePlanUpdatedAt` (object-level LWW across devices).

## Troubleshooting

| Issue | Fix |
|-------|-----|
| “Local only — add firebase-config.js” | Fill in `firebase-config.js` (not placeholders) |
| Popup blocked on phone | Redirect sign-in; use a stable URL (no `?v=` query) |
| Sign-in loops back to “Sign in to sync…” | Add `YOUR_USERNAME.github.io` in Authorized domains; on iPhone disable Private Browsing / cross-site tracking |
| `auth/unauthorized-domain` | Add your `*.github.io` domain in Authorized domains |
| Permission denied in Firestore | Publish `firestore.rules` from this repo |
| Stuck on “Loading your day…” after refresh | Hard refresh again after latest deploy; if it persists, check browser console for JS errors (tab UI must run only after data loads) |
