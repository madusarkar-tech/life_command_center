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

## Workday template (Sun–Thu) — flowchart model

Day starts at **logged wake time**. Build order matches the flowchart:

1. Sudden tasks (overlay)
2. Fixed clock blocks (breakfast → evening anchors)
3. **Variable blocks by priority** (before any open time): PMP (1) → gym + shower (2) → job apps (3)
4. Non-fixed pick (one of Read / AI / QGIS) in leftover time
5. **Open time** — only what remains, then deploy

### Fixed (clock or wake-anchored)

| Block | When | Duration |
|-------|------|----------|
| Breakfast | From wake | **60m** if wake before **10:30 AM**; **30m** if wake at or after 10:30 |
| Dinner prep | 3:30–4:00 PM | 30m |
| Dog walk & feed | 4:45–5:30 PM | 45m |
| Dinner | 6:00–7:30 PM | 90m |
| Garden & chickens | 7:30–8:00 PM | 30m |
| **Work** | 8:00 PM–3:00 AM | 7h (Bangkok 7a–3p) |
| **Sleep** | ~4:00 AM | Protected block |

### Variable (placed in gaps before 3:30 PM / before work — **priority order**)

| Priority | Block | Rules |
|----------|-------|--------|
| 1 | PMP deep study | One **2h** block in the largest morning gap; until **June 22, 2026**, then skipped |
| 2 | Gym + shower | Gym: ≥1h15 → gym + 30m commute each way (duration clipped to gap); else home **≥20m** (up to 2h). Variables start **right after breakfast** (no extra buffer hour). If the only **60m** gap sits immediately before PMP’s 2h slot, gym may use it and PMP takes the next largest gap. Wed default skip. Shower: 30m after gym, before shift |
| 3 | Job applications | ≥30m/day anywhere before work; checking the block marks **Job applications** habit |

### Non-fixed (one per day if time remains)

Pick one: Read, Do AI work, or QGIS — **Extra** control (Auto / manual / Skip). Auto rotates by date.

**Late wake:** Fixed clock blocks never move. Overlapping blocks show an OVERLAP tag; banner explains what could not fit.

**Buffer line:** Minutes free before 8:00 PM work start, or over-packed warning.

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
| Workout: Gym / Home / Skip | Auto: gym if ≥1h15 free (+ commute); else home ≥20m. Manual override. Wed auto-skip |
| Sudden tasks | Anytime or fixed window; today vs future rules; displaces into open time |
| Weekend plan | Night before: build Friday/Saturday activity list; schedule packs from wake |
| Edit block lengths | Permanent default per day type (saved in `templateDur`) |
| To-do list | Rolls over until done; optional due dates; most urgent surfaces in Quick Glance |

## Dog & meal windows (workday flowchart)

- Dinner prep: **3:30–4:00 PM**
- Dog walk & feed: **4:45–5:30 PM**
- Dinner: **6:00–7:30 PM**
- Garden: **7:30–8:00 PM**

## What the dashboard does *not* do (yet)

- Sync across phone and laptop (localStorage only on one browser)
- Google Calendar / Todoist integration
- Cloud backup

See [BUILD-HISTORY.md](BUILD-HISTORY.md) for feature evolution and possible future ideas.
