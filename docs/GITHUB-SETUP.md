# GitHub & GitHub Pages setup

## How to check if the repo is already on GitHub

In Terminal:

```bash
cd ~/Projects/life-command-center
git remote -v
```

| Result | Meaning |
|--------|---------|
| **No output** | Not on GitHub yet — only on your Mac |
| `origin  https://github.com/USERNAME/REPO.git` | Already linked — note the URL |

Also open [github.com](https://github.com) → your profile → **Repositories** and look for `Scheduler` (or similar).

---

## Push this project to GitHub (first time)

### 1. Create an empty repo on GitHub

1. [github.com/new](https://github.com/new)
2. Name: `Scheduler` (or `life-command-center`)
3. **Private** recommended (your todos/job list sync here)
4. Do **not** add README / .gitignore (you already have them)
5. Create repository

### 2. Link and push

Replace `YOUR_USERNAME` and `REPO_NAME`:

```bash
cd ~/Projects/life-command-center
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

If prompted, sign in with GitHub (browser or personal access token).

### 3. Verify

```bash
git remote -v
```

Refresh your repo on github.com — you should see `life-dashboard.html`, `docs/`, etc.

---

## Enable GitHub Pages

1. GitHub repo → **Settings** → **Pages**
2. **Build and deployment** → Source: **Deploy from a branch**
3. Branch: **`main`** → folder: **`/ (root)`** → **Save**
4. Wait 1–3 minutes. Your site URL will show, e.g.:

   `https://YOUR_USERNAME.github.io/REPO_NAME/`

5. Open:

   `https://YOUR_USERNAME.github.io/REPO_NAME/life-dashboard.html`

   (or the root URL — `index.html` redirects to the dashboard)

### Before Pages works with sync

1. Complete [FIREBASE-SETUP.md](FIREBASE-SETUP.md)
2. Add your Pages domain in Firebase **Authorized domains**:
   - `YOUR_USERNAME.github.io`

---

## Phone: Add to Home Screen

1. Open your Pages URL in **Safari** on iPhone
2. **Share** → **Add to Home Screen**
3. **Sign in with Google** (same account as Mac)

---

## Update the site after changes

```bash
cd ~/Projects/life-command-center
git add -A
git commit -m "Describe your change"
git push
```

Pages redeploys automatically within a few minutes.
