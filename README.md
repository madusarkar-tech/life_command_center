# Life Command Center

A single-page personal dashboard for managing a remote night-shift schedule, PMP exam prep, job search, daily habits, and a rolling to-do list.

**Sync:** Sign in with Google to keep the same data on Mac and phone (Firebase).  
**Setup:** [Firebase](docs/FIREBASE-SETUP.md) · [GitHub Pages](docs/GITHUB-SETUP.md)

## Quick start (Mac)

**Desktop app:** double-click `Life Command Center.app` on your Desktop.

**Browser:**

```bash
cd ~/Desktop/Scheduler
python3 -m http.server 8765
```

Open **http://localhost:8765/life-dashboard.html**

## Check if you're on GitHub

```bash
git remote -v
```

No output = local only. See [docs/GITHUB-SETUP.md](docs/GITHUB-SETUP.md) to push and enable Pages.

## Hosted URL (after GitHub Pages)

`https://YOUR_USERNAME.github.io/REPO_NAME/life-dashboard.html`

## What it does

| Tab | Purpose |
|-----|---------|
| **Today** | Period bands (sudden tasks ⚡, skip ✕, reorder), Today's Flow timeline, alarms, to-dos, habit chips in Quick Glance |
| **PMP Prep** | Study log, domain sliders, countdown to June 22, 2026 (hidden after exam day) |
| **Job Search** | Application pipeline, deadline Aug 1, 2026; primary flexible schedule focus after June 22, 2026 (>2h/day on workdays) |

Design details: [docs/DESIGN.md](docs/DESIGN.md) · Build history: [docs/BUILD-HISTORY.md](docs/BUILD-HISTORY.md) · Onboarding: [docs/HANDOFF.md](docs/HANDOFF.md)

**Stable baseline:** tag `baseline-2026-06-09` (app `884cd10` — sudden ↔ bands, skip-for-today, capacity warnings) — contract in [docs/BASELINE.md](docs/BASELINE.md). Say *"Return to baseline"* in a new chat to anchor agents there.

## Data persistence

- **Signed out:** saves to browser `localStorage` on that device only.
- **Signed in:** syncs to your Firebase account (Mac + phone share one dataset).

## Project layout

```
life-dashboard.html      # The app
firebase-config.js       # Your Firebase keys (edit before sync works)
firebase-config.example.js
index.html               # Redirect for GitHub Pages root URL
firestore.rules          # Paste into Firebase Console
docs/
```

## License

Personal project — use and modify freely.
