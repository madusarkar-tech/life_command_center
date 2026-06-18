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
| **Today** | Four period bands (night locked Sun–Thu); sudden ⚡, skip ✕, pin 📌, **open-time slots ⏳**; reorder; Today's Flow timeline; alarms; **Work / Other to-dos**; **Weekly habits** sidebar; **Workout log** below grid |
| **Week** | Sun–Sat calendar (5am–midnight); tap slots to add fixed-window appointments; Flex row for anytime tasks |
| **PMP Prep** | Study log, domain sliders, notes, countdown to June 22, 2026 (hidden after exam day; can be hidden manually) |
| **Job Search** | Application pipeline, notes, deadline Aug 1, 2026; primary flexible schedule focus after June 22, 2026 (>2h/day on workdays) |
| **Custom tabs** | Add via **⋯** on the tab bar — notes-only focus areas (rename/remove in tab manager) |

**Tab manager:** click **⋯** at the end of the tab bar to show/hide Week, PMP Prep, and Job Search, or add custom note tabs. Today always stays visible. Preferences sync via `DATA.tabUi`.

Design details: [docs/DESIGN.md](docs/DESIGN.md) · Build history: [docs/BUILD-HISTORY.md](docs/BUILD-HISTORY.md) · Onboarding: [docs/HANDOFF.md](docs/HANDOFF.md)

**Stable baseline:** tag `baseline-2026-06-10` (app `540a3a5`) — contract in [docs/BASELINE.md](docs/BASELINE.md). Current `main` is `cab37ed` (open-time slots in bands, pin fixes, job to-do delete sync). Say *"Return to baseline"* in a new chat to anchor agents at the tag.

## Data persistence

- **Signed out:** saves to browser `localStorage` on that device only.
- **Signed in:** syncs to your Firebase account (Mac + phone + iPad share one dataset). Field-level merge for bands (including open-time slots), notes, and pins; list-level merge for todos, job todos, and job pipeline; per-date merge for weekly habits and workout log; object-level LWW for tab visibility/custom tabs (`tabUi`); merge-before-push on save.

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
