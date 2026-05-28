# Life Command Center

A single-page personal dashboard for managing a remote night-shift schedule, PMP exam prep, job search, daily habits, and a rolling to-do list. Built from a planning conversation with Claude (see [docs/BUILD-HISTORY.md](docs/BUILD-HISTORY.md)).

## Quick start

**Open directly:** double-click `life-dashboard.html` or open it in any browser.

**Local server (recommended):**

```bash
cd /Users/maduswaisgood/Desktop/Scheduler
python3 -m http.server 8765
```

Then visit: **http://localhost:8765/life-dashboard.html**

## What it does

| Tab | Purpose |
|-----|---------|
| **Today** | Wake-time-driven schedule (workday / Friday / Saturday), sudden tasks, workout modes, rollover to-dos with due dates |
| **Daily Non-Negotiables** | Habit streaks (sleep, gym, study, dogs, chickens, garden, meals) |
| **PMP Prep** | Study session log, domain readiness sliders, countdown to June 22, 2026 |
| **Job Search** | Kanban pipeline (Lead → Applied → Interview → Offer → Closed), deadline Aug 1, 2026 |

Design constraints and schedule logic are documented in [docs/DESIGN.md](docs/DESIGN.md).

## Data persistence

Progress saves automatically in **localStorage** on the browser/device you use (key: `lifehub:data`). Use the same browser on the same machine for continuity. Clearing site data will reset the dashboard.

## Repository layout

```
life-dashboard.html   # The app (HTML + CSS + JS, no build step)
docs/
  DESIGN.md         # Your life constraints and schedule rules
  BUILD-HISTORY.md  # How the dashboard was built (conversation summary)
```

## Hard deadlines (configured in the app)

- **PMP exam:** June 22, 2026
- **New job target:** August 1, 2026

## License

Personal project — use and modify freely.
