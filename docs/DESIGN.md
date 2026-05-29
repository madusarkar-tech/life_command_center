# Design: Life Command Center

This document captures the real-world constraints that shaped the dashboard. It is the distilled “why” behind `life-dashboard.html`.

## Context

- **Location:** Tallahassee, FL (America/New_York)
- **Work:** Remote, Bangkok hours **7:00 AM – 3:00 PM** (local **8:00 PM – 4:00 AM**)
- **Weekends:** Friday and Saturday (no shift those nights)
- **Goals:**
  - Pass **PMP** by **June 22, 2026** (primary focus until exam day)
  - Land a **new job by August 1, 2026** (primary off-work focus after exam)
  - Daily operations: gym, dogs, chickens, garden, proper meals

## Non-negotiable principles

1. **Sleep is the constraint.** One protected daytime sleep block (~4:00 AM – ~10:00 AM). Avoid split sleep (sleep → wake for work check → sleep again); wrap work before logoff when possible.
2. **PMP until June 22.** Job search is background prep only until the exam; then job search owns the sharp afternoon block.
3. **Operations are capped.** Animals, garden, meals, and workouts use fixed blocks — not unlimited time sinks.
4. **Meal prep is batched.** Saturday batch prep feeds weekday “reheat” lunches; workdays show a banner if last Saturday’s prep was skipped.

## Workday template (Sun–Thu)

Anchored to **wake time** (default ~10:00 AM; “Just woke up” sets anchor to now).

| Block | Typical duration | Notes |
|-------|------------------|-------|
| Wake & animals | 60m | Coffee, dogs, chickens, breakfast |
| PMP deep study | 120m | Sharpest window after coffee |
| Workout | 120m gym / 45m home / skip | **Wednesday defaults to skip** |
| Shower & lunch | 60m | Reheat from batch prep |
| PMP flashcards | 30m | Light review |
| Dog walk + dinner | 45m | 4:30–5:15 PM window |
| Garden & chickens | 45m | Golden hour |
| Your dinner | 60m | 6:00–7:00 PM |
| Dog walk #2 | 20m | ~7:00 PM |
| Pre-shift nap | 40m | ~25 min max + transition |
| **Work** | 8h | **8:00 PM** start (pinned wall) |
| **Sleep** | — | **4:00 AM** protected block |

**Buffer line:** On workdays, the UI shows minutes free before 8:00 PM or warns if the day is over-packed.

## Friday & Saturday (weekend days)

- No work shift — sleep when ready
- **Night before:** use “Plan day” to list activities (gym, PMP, meal prep, hobby, dinner ~7, read, etc.)
- Agent packs your list from wake time with **open time** gaps between items (for sudden tasks)
- Legacy templates still apply if you have not saved a plan yet
- Saturday batch meal prep still feeds the workday meal-prep banner when logged

## Flexible controls

| Control | Behavior |
|---------|----------|
| Wake time / “Just woke up” | Recomputes all block start times downstream |
| Day type (Auto / Workday / Friday / Saturday) | Auto uses weekday; override for swapped days |
| Workout: Gym / Home / Skip | Home = 45m; Skip removes block; Wed auto-skip on workdays |
| Sudden tasks | Anytime or fixed window; today vs future rules; displaces into open time |
| Weekend plan | Night before: build Friday/Saturday activity list; schedule packs from wake |
| Edit block lengths | Permanent default per day type (saved in `templateDur`) |
| To-do list | Rolls over until done; optional due dates; most urgent surfaces in Quick Glance |

## Dog & meal windows (fixed in template)

- Dog walk #1 + dinner: **4:30–5:15 PM** (45m block)
- Your dinner: **6:00–7:00 PM**
- Dog walk #2: **~7:00 PM** (20m)

## What the dashboard does *not* do (yet)

- Sync across phone and laptop (localStorage only on one browser)
- Google Calendar / Todoist integration
- Cloud backup

See [BUILD-HISTORY.md](BUILD-HISTORY.md) for feature evolution and possible future ideas.
