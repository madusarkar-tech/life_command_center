# Design: Life Command Center

This document captures the real-world constraints that shaped the dashboard. It is the distilled “why” behind `life-dashboard.html`.

**Weekday scheduling source of truth:** period-band model (v1). Legacy lifechart2 gap/clock packing is retired for workdays. Weekend plan flow unchanged.

## Context

- **Location:** Tallahassee, FL (America/New_York)
- **Work:** Remote, Bangkok hours **7:00 AM – 3:00 PM** (local **8:00 PM – 4:00 AM**)
- **Weekends:** Friday and Saturday (no shift those nights)
- **Goals:**
  - Pass **PMP** by **June 22, 2026** (primary focus until exam day)
  - Land a **new job by August 1, 2026** (primary off-work focus after exam)
  - Daily operations: gym, dogs, chickens, garden, proper meals

## Non-negotiable principles (product context)

1. **Sleep is the constraint.** One protected sleep block (~3:00 AM → logged wake). Avoid split sleep; wrap work before logoff when possible.
2. **Goals:** PMP exam **June 22, 2026** (through that date inclusive); job target **August 1, 2026** — job countdown always shown; PMP UI only through exam day.
3. **Operations are capped.** Animals, garden, meals, and workouts use scheduled blocks with durations — not unlimited time sinks.
4. **Meal prep is batched.** Saturday `mealprep` feeds weekday lunches; workdays show a banner if last Saturday’s prep was skipped.

## Workday template — period bands (v1)

Only **work (night)** is a hard anchor. Daytime is three **bands**; tasks are stacked in order inside each band. **Open time** flex rows fill unused minutes within a band.

### Band windows

| Band | Window |
|------|--------|
| **Morning** | Logged wake → 2:00 PM |
| **Afternoon** | 2:00 PM → 5:00 PM |
| **Evening** | 5:00 PM → 8:00 PM |
| **Night (work)** | 8:00 PM → 3:00 AM — anchor, not reorderable |
| **Sleep** | 3:00 AM → wake — protected |

### Default task lists (pre–June 23, 2026)

| Morning | Afternoon | Evening |
|---------|-----------|---------|
| Breakfast | PMP2 (`study2`) | Dog walk & feed (`dog1`) |
| PMP1 (`study1`) | Job applications (`jobapps`) | Dinner (`dinner`) |
| Workout (`gym`) | Non-fixed (Read / AI / QGIS) | Garden (`garden`) |
| | Dinner prep (`dinnerprep`, 20m) | |

Afternoon order: **study2 → jobapps → nonFixed → dinnerprep**.

### Default task lists (post–June 23, 2026)

| Morning | Afternoon | Evening |
|---------|-----------|---------|
| Breakfast | Job applications (`jobapps` + `jobapps2`, >2h total) | Dog, dinner, garden |
| Workout (`gym`) | Non-fixed, dinner prep (20m) | |
| *Open time* in unused morning slots | | |

PMP blocks removed; morning open time is for custom activities (add via band UI).

### Today-only overrides (`dayConfig[date]`)

- **periodOrder** — ↑↓ reorder within a band today only.
- **periodMoves** — move a task to another band today only (e.g. gym → morning).
- **periodExtras** — custom named activities in a band (post-exam open time).
- **Reset today's order** — clears overrides; defaults return.

Sync via existing Firebase `dayConfig` merge.

### Still applies

- **Wake** / “Just woke up” — starts morning band.
- **Workout** Gym / Home / Skip — affects gym duration in whichever band gym sits.
- **Sudden tasks** — applied after band packing; can displace/replace blocks.
- **Edit block lengths** — `blockDur` per day.
- **Non-fixed** Extra control — resolves `nonFixed` slot in afternoon.

### Minimums & warnings

- PMP habit: ≥120m from `study1`/`study2` + sessions (through exam day).
- Job: ≥30m pre-exam; >2h post-exam from job blocks.
- Band **overfull** warning if stacked tasks exceed band end time.

## Friday & Saturday (weekend days)

- No work shift — sleep when ready
- **Plan day** modal packs an ordered list from wake (unchanged in v1)
- Saturday **mealprep** for the week — not on workday afternoon list

## Flexible controls

| Control | Behavior |
|---------|----------|
| Wake time / “Just woke up” | Morning band starts at wake |
| Day type (Auto / Workday / Friday / Saturday) | Auto uses weekday |
| Workout: Gym / Home / Skip | Gym block duration/placement |
| Sudden tasks | Anytime or fixed window |
| Weekend plan | Friday/Saturday activity list |
| Edit block lengths | Today only (`blockDur`) |
| Today's bands | Reorder / move tasks between morning · afternoon · evening |

## What the dashboard does *not* do (yet)

- Cloud backup beyond Firebase sign-in
- Google Calendar / Todoist integration

See [BUILD-HISTORY.md](BUILD-HISTORY.md) for feature evolution.
