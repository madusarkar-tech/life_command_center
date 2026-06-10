# Design: Life Command Center

This document captures the real-world constraints that shaped the dashboard. It is the distilled “why” behind `life-dashboard.html`.

**Scheduling source of truth:** period-band model (v1). Workdays: 3 bands + work/sleep. Weekends: 4 bands (incl. night 8pm–midnight) + weekly Plan templates.

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
- **periodMoves** — move a task to another band today only (e.g. gym → morning); sudden tasks use keys `sudden:st_*`.
- **periodExtras** — custom named activities in a band (post-exam open time).
- **periodSkips** — ✕ skip a task for today only; **↺ unskip all tasks** restores defaults.
- **periodPinnedStart** — 📌 pin a task to a clock time within its band (e.g. gym at 11:00); `packPeriodBand` honors pins.
- **blockDur** — today-only duration per task key; edited via **−/+ steppers** on band rows (not a separate timeline edit mode).
- **suddenTasks** — sudden / planned appointments; appear in bands as ⚡ rows; packed in band order; also shown on **Week** tab.
- **Reset today's order** — clears `periodOrder` / `periodMoves` / `periodExtras`; does not clear skips, pins, or suddens.

Each field above has its own `fieldUpdatedAt` timestamp for per-field sync merge (`mergeDayEntry`).

### Band row controls (workdays)

- **Gym row:** Gym / Home / Skip picker (replaces former top Workout row).
- **Non-fixed row:** Auto / Read / AI / QGIS / Skip picker (replaces former top Extra row).
- **⏱ toggle:** optional 5-minute end warning for that task (`alarmEndTasks`).
- **📌 pin:** set a start time within the band window (`periodPinnedStart`).

### Today's Flow (computed timeline)

- Built from band packing (`packPeriodBand`); read-only for durations.
- Labels show **duration only** (e.g. `60m`) — no subtitle hints like “1h from wake”.
- Checkboxes for block completion; **Alarms** / **End warn** toggles in the header.

### Sudden tasks & bands

- Stored in `dayConfig[date].suddenTasks` (may be in any date bucket; `targetDayKey` selects schedule day).
- Shown in **Today's bands** as ⚡ with reorder, move, duration, remove.
- **Fixed window** (e.g. 10–11am): keeps clock time on timeline; band reorder changes what packs before/after.
- **Anytime**: packed sequentially in band order like other tasks.
- On add with overlap: `displaceSuddenOverlaps` tries `periodMoves` for displaced tasks (gym → afternoon/evening first).
- Remaining suddens not packed in bands may still flow through `applySuddenTasks`.

### Week calendar tab

- **Grid:** Sun–Sat columns, hours **5:00 AM – midnight** (`WEEK_CAL_START_H` / `WEEK_CAL_END_H`).
- **Fixed-window suddens** render as positioned blocks; **anytime** suddens appear in a **Flex** row above the grid.
- **Tap an hour slot** → `calEventModal` → creates a fixed-window sudden task on that day.
- **Tap an event** → edit or delete via the same modal.
- Prev / next week and **Today** buttons adjust `weekViewOffset`.
- Data source is the same `dayConfig[*].suddenTasks` store as Today's bands — not a separate calendar backend.

### Notes (scratch, PMP, job)

- `todayNotes` (Today scratchpad), `pmpNotes`, `jobNotes` — each field syncs independently with `*UpdatedAt` timestamps.
- Debounced input calls `commitNoteField()` → `save()`.

### Still applies

- **Wake** / “Just woke up” — starts morning band.

### Task alarms

- **Start-of-block** alerts when a scheduled block begins (default on via `alarmOn`).
- **End warning** — optional 5 minutes before block end, per task via ⏱ on band rows (`alarmEndOn`, `alarmEndTasks`).
- `checkTaskAlarms()` runs every 15s while the tab is open; Web Audio beep + toast; browser notifications if permitted.

### Minimums & warnings

- PMP habit: ≥120m from `study1`/`study2` + sessions (through exam day).
- Job: ≥30m pre-exam; >2h post-exam from job blocks.
- **Band capacity:** band task list can exceed the band window. When `packPeriodBand` cannot fit a task (&lt;5m room left), it is skipped on the timeline:
  - Toast on add/move when the band is already overfull (`flashBandCapacityWarning`).
  - **#conflictBanner** lists tasks that did not pack (`skippedBandConflicts`).
  - Band rows show **· not on timeline** for unpacked tasks.
  - Overfull add/move is still allowed — shorten durations or move tasks to fix.

## Friday & Saturday (weekend days)

- No work shift — sleep when ready
- **Four bands:** morning (wake→2pm), afternoon (2–5pm), evening (5–8pm), **night (8pm–midnight)**
- **Plan** modal (Friday/Saturday tabs): edit weekly band templates — reorder, move, **remove (✕)**, add per band; each row shows **minutes**; band header shows **used/capacity** (morning uses 10am wake or today’s wake if that day type is active)
- **Today's bands** on Fri/Sat: same today-only overrides as workdays (`periodOrder`, `periodMoves`, `periodExtras`)
- Legacy flat `weekendPlan` per date migrates into templates on first load
- Saturday **mealprep** for the week — not on workday afternoon list

## Flexible controls

| Control | Behavior |
|---------|----------|
| Wake time / “Just woke up” | Morning band starts at wake |
| Day type (Auto / Workday / Friday / Saturday) | Auto uses active day key (4am rollover) |
| Workout: Gym / Home / Skip | On gym band row; affects gym duration |
| Non-fixed: Auto / Read / AI / QGIS / Skip | On non-fixed band row (workdays) |
| Sudden tasks | Anytime or fixed window; ⚡ in Today's bands; skip via ✕ |
| Skip for today | ✕ on band row or timeline → `periodSkips` |
| Weekend plan | Weekly Fri/Sat band templates (Plan modal) |
| Block lengths (`blockDur`) | −/+ steppers on Today's band rows |
| Task alarms | Start-of-block (default on); ⏱ end warn per task |
| Pin start time | 📌 on band row → `periodPinnedStart` |
| Week calendar | Sun–Sat grid; tap slot to add fixed-window sudden |
| Today's bands | Reorder / move / drag between bands (workday: 3 + work; weekend: 4) |

## Sync model (Firebase)

- **Local:** `lifehub:data`, `lifehub:meta` (`updatedAt`).
- **Cloud:** Firestore `users/{uid}` `{ data, updatedAt }`.
- **Load / snapshot:** `mergeAppData` combines local + cloud; `writeLocalAfterSync` sets meta to `max(local, cloud)`.
- **Push:** `pushCloud` merge-before-push — reads cloud, merges, then writes (avoids stale device overwrite).
- **dayConfig:** per-date, per-field LWW on `DAY_LWW_FIELDS` (wake, bands, suddens, pins, etc.).
- **Notes:** per-field LWW on `todayNotes`, `pmpNotes`, `jobNotes`.
- **Todos:** list-level LWW — entire `todos` / `jobTodos` array wins by `todosUpdatedAt` / `jobTodosUpdatedAt`.
- **Habits:** date-set union per habit id.
- **Jobs:** id union (`mergeIdArrays`) — deletes on one device may reappear from the other.

## What the dashboard does *not* do (yet)

- Cloud backup beyond Firebase sign-in
- Google Calendar / Todoist integration
- **Recurring calendar events**
- **Gym spillover** — if morning band is full, gym should try afternoon/evening before dropping lower-priority tasks (partial: displacement on sudden add only)

See [BUILD-HISTORY.md](BUILD-HISTORY.md) for feature evolution.
