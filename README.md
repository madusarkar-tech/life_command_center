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
| **Life Plan** | **Life phases** with date ranges; per-phase **default day template** (bands + durations); **PMP / Job module toggles**; north-star notes; drives Today's default bands |
| **PMP Prep** | Study log, domain sliders, notes, countdown to June 22, 2026 (hidden when phase module off or via tab manager) |
| **Job Search** | Application pipeline, notes, deadline Aug 1, 2026; primary focus after exam when job-hunt phase is active |
| **Custom tabs** | Add via **⋯** on the tab bar — notes-only focus areas (rename/remove in tab manager) |

**Tab manager:** click **⋯** at the end of the tab bar to show/hide Week, PMP Prep, and Job Search, or add custom note tabs. **Today** and **Life Plan** always stay visible. Preferences sync via `DATA.tabUi`; Life Plan blueprint syncs via `DATA.lifePlan`.

Design details: [docs/DESIGN.md](docs/DESIGN.md) · Build history: [docs/BUILD-HISTORY.md](docs/BUILD-HISTORY.md) · Onboarding: [docs/HANDOFF.md](docs/HANDOFF.md)

**Stable baseline:** tag `baseline-2026-06-24` (app `4d596e9`) — contract in [docs/BASELINE.md](docs/BASELINE.md). Includes Life Plan Phase 1, open-time slots, pin fixes, and **habit sleep sync** (`sleepHrsUpdatedAt`). Say *"Return to baseline"* in a new chat to anchor agents at the tag.

## Data persistence

- **Signed out:** saves to browser `localStorage` on that device only.
- **Signed in:** syncs to your Firebase account (Mac + phone + iPad share one dataset). Field-level merge for bands (including open-time slots), notes, and pins; object-level LWW for **Life Plan** (`lifePlan`) and tab visibility (`tabUi`); list-level merge for todos, job todos, and job pipeline; per-date merge for weekly habits (sleep LWW on `sleepHrsUpdatedAt`, max water, OR workout) and workout log; merge-before-push on save.

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
