# Design: Life Command Center

This document captures the real-world constraints that shaped the dashboard. It is the distilled “why” behind `life-dashboard.html`.

**Scheduling source of truth:** period-band model (v2). **Four bands every day**; shift nights lock the night band to work; off nights (Fri–Sat) use the night band like any other.

## Context

- **Location:** Tallahassee, FL (America/New_York)
- **Work:** Remote, Bangkok hours **7:00 AM – 3:00 PM** (local **8:00 PM – 4:00 AM**)
- **Off-shift nights:** Friday and Saturday (no shift those nights)
- **Goals:**
  - Pass **PMP** by **June 22, 2026** (primary focus until exam day)
  - Land a **new job by August 1, 2026** (primary off-work focus after exam)
  - Daily operations: gym, dogs, chickens, garden, proper meals

## Non-negotiable principles (product context)

1. **Sleep is the constraint.** One protected sleep block (~3:00 AM → logged wake). Avoid split sleep; wrap work before logoff when possible.
2. **Goals:** PMP exam **June 22, 2026** (through that date inclusive); job target **August 1, 2026** — job countdown always shown; PMP UI only through exam day.
3. **Operations are capped.** Animals, garden, meals, and workouts use scheduled blocks with durations — not unlimited time sinks.
4. **Meal prep is batched.** Saturday batch prep feeds weekday lunches; shift days show a banner if last Saturday’s prep was skipped (manual `mealPrep` checkbox).

## Period bands (v2) — one model for all days

Daytime and night use the same **band stack**. Only the **night band behavior** differs by calendar day.

### Band windows

| Band | Window |
|------|--------|
| **Morning** | Logged wake → 2:00 PM |
| **Afternoon** | 2:00 PM → 5:00 PM |
| **Evening** | 5:00 PM → 8:00 PM |
| **Night** | 8:00 PM → midnight — editable on off days; **locked on shift days** |
| **Work (shift only)** | 8:00 PM → 3:00 AM — fixed on timeline, not packed in bands |
| **Sleep (shift only)** | 3:00 AM → wake — protected |

### Shift vs off (calendar only)

| Calendar | Shift? | Night band | Timeline after 8pm |
|----------|--------|------------|----------------------|
| Sun–Thu | Yes | Locked — “Work shift” row in Today's bands | Work block + Sleep block |
| Fri–Sat | No | Editable — reorder, move, extras, skips | Packed night-band tasks; optional “after midnight” info row |

No day-type picker. `hasWorkShift(dayKey)` uses day-of-week from the active date key (4am rollover). Stored `dayConfig[date].dayType` overrides are no longer applied.

### Default task lists (pre–June 23, 2026)

| Morning | Afternoon | Evening | Night |
|---------|-----------|---------|-------|
| Breakfast | PMP2 (`study2`) | Dog walk & feed (`dog1`) | *(empty)* |
| PMP1 (`study1`) | Job applications (`jobapps`) | Dinner (`dinner`) | |
| Workout (`gym`) | Non-fixed (Read / AI / QGIS) | Garden (`garden`) | |
| | Dinner prep (`dinnerprep`, 20m) | | |

Afternoon order: **study2 → jobapps → nonFixed → dinnerprep**.

### Default task lists (post–June 23, 2026)

| Morning | Afternoon | Evening | Night |
|---------|-----------|---------|-------|
| Breakfast | Job applications (`jobapps` + `jobapps2`, >2h total) | Dog, dinner, garden | *(empty)* |
| Workout (`gym`) | Non-fixed, dinner prep (20m) | | |
| *Open time* in unused morning slots | | | |

PMP blocks removed; morning open time is for custom activities (add via band UI).

Defaults live in `DATA.periodTemplate` (`preExam` / `postExam`) with the same lists for shift and off days. Customize per day via **Today's bands** overrides only — there is no separate weekend template store.

### Today-only overrides (`dayConfig[date]`)

- **periodOrder** — ↑↓ reorder within a band today only.
- **periodMoves** — move a task to another band today only (e.g. gym → morning); sudden tasks use keys `sudden:st_*`.
- **periodExtras** — custom named activities in a band.
- **periodSkips** — ✕ skip a task for today only; **↺ unskip all tasks** restores defaults.
- **periodPinnedStart** — 📌 pin a task to a clock time within its band (e.g. gym at 11:00); `packPeriodBand` honors pins.
- **blockDur** — today-only duration per task key; edited via **−/+ steppers** on band rows (not a separate timeline edit mode).
- **suddenTasks** — sudden / planned appointments; appear in bands as ⚡ rows; packed in band order; also shown on **Week** tab.
- **Reset today's order** — clears `periodOrder` / `periodMoves` / `periodExtras`; does not clear skips, pins, or suddens.

Each field above has its own `fieldUpdatedAt` timestamp for per-field sync merge (`mergeDayEntry`).

### Band row controls

- **Gym row:** Gym / Home / Skip picker.
- **Non-fixed row:** Auto / Read / AI / QGIS / Skip picker.
- **⏱ toggle:** optional 5-minute end warning for that task (`alarmEndTasks`).
- **📌 pin:** set a start time within the band window (`periodPinnedStart`).
- **Shift night row:** read-only Work label in the night band (no add/reorder).

### Today's Flow (computed timeline)

- Built from `buildPeriodSeq()` → `packPeriodBand()` for morning–evening (+ night on off days).
- Labels show **duration only** (e.g. `60m`).
- Checkboxes for block completion; **Alarms** / **End warn** toggles in the header.
- Shift days append fixed **Work** and **Sleep** blocks after packed daytime/evening bands.

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

### Weekly habits (Today sidebar)

Tracks three daily habits with a Sun–Sat week grid and weekly completion percentages:

| Habit | Goal | Storage |
|-------|------|---------|
| Sleep | ≥ 6 hours | `DATA.habitDaily[date].sleepHrs` |
| Workout | Mark done | `DATA.habitDaily[date].workout` |
| Water | ≥ 5 glasses | `DATA.habitDaily[date].water` |

- **Grid** — shows partial progress (`3/5`, sleep hours) or `✓` when goal met; **tap a cell** to log (water +1, workout toggle, sleep selects day).
- **Log panel** — bordered box below grid with sleep input, workout button, water −/+ stepper.
- **Workout auto-sync** — checking today's gym schedule block can set workout true; manual un-mark uses `workoutOff` to block re-sync on that device.
- **Sync** — `mergeHabitDailyMap`: max sleep/water per date, OR workout across devices.

Legacy `DATA.habits` (date-set union) still powers PMP study habit from schedule block completion.

### Workout log (Today, full-width below main grid)

Separate from the schedule's gym band — a week planner and lift logger:

- **Plan grid** — Sun–Sat rows for **Yoga**, **Cardio**, **Lift** (tap checkbox per day).
- **Lift panel** — when lift is planned for selected day: add exercises (presets + free text), log weight/reps per set.
- **Monthly summary** — per exercise: max weight, average weight, session count.
- **Storage** — `DATA.gymLog[date] = { plan: { yoga, cardio, lift }, exercises: [...], updatedAt }`.
- **Sync** — `mergeGymLogMap`: OR plan flags; union exercises/sets by `weight|reps` signature.

### To-Do (Today)

- Split into **Work** and **Other** sections (`DATA.todos[].list`).
- List-level LWW sync via `todosUpdatedAt` (whole list wins).
- Most urgent due item surfaces in the **Right now** banner (`mostUrgentTodo()`).

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

## Flexible controls

| Control | Behavior |
|---------|----------|
| Wake time / “Just woke up” | Morning band starts at wake |
| Shift vs off | **Calendar only** — Fri/Sat off; Sun–Thu shift (`hasWorkShift`) |
| Workout: Gym / Home / Skip | On gym band row; affects gym duration |
| Non-fixed: Auto / Read / AI / QGIS / Skip | On non-fixed band row |
| Sudden tasks | Anytime or fixed window; ⚡ in Today's bands; skip via ✕ |
| Skip for today | ✕ on band row or timeline → `periodSkips` |
| Block lengths (`blockDur`) | −/+ steppers on Today's band rows |
| Task alarms | Start-of-block (default on); ⏱ end warn per task |
| Pin start time | 📌 on band row → `periodPinnedStart` |
| Week calendar | Sun–Sat grid; tap slot to add fixed-window sudden |
| Today's bands | Reorder / move / drag across all four bands (night locked on shift days) |
| Weekly habits | Tap grid or use Log panel; sleep / workout / water tracked per day |
| Workout log | Week planner (yoga/cardio/lift) + lift sets; monthly stats |

## Sync model (Firebase)

- **Local:** `lifehub:data`, `lifehub:meta` (`updatedAt`).
- **Cloud:** Firestore `users/{uid}` `{ data, updatedAt }`.
- **Load / snapshot:** `mergeAppData` combines local + cloud; `writeLocalAfterSync` sets meta to `max(local, cloud)`.
- **Push:** `pushCloud` merge-before-push — reads cloud, merges, then writes (avoids stale device overwrite).
- **dayConfig:** per-date, per-field LWW on `DAY_LWW_FIELDS` (wake, bands, suddens, pins, etc.).
- **Notes:** per-field LWW on `todayNotes`, `pmpNotes`, `jobNotes`.
- **Todos / job todos / jobs:** list-level LWW — entire array wins by `todosUpdatedAt` / `jobTodosUpdatedAt` / `jobsUpdatedAt`.
- **Habits (legacy):** date-set union per habit id (PMP study from blocks).
- **habitDaily:** per-date merge — max sleep/water, OR workout (`mergeHabitDailyMap`).
- **gymLog:** per-date merge — OR plan flags; union lift exercises/sets (`mergeGymLogMap`).

## What the dashboard does *not* do (yet)

- Cloud backup beyond Firebase sign-in
- Google Calendar / Todoist integration
- **Recurring calendar events**
- **Gym spillover** — if morning band is full, gym should try afternoon/evening before dropping lower-priority tasks (partial: displacement on sudden add only)
- Separate weekly Fri/Sat band templates (removed — use Today's bands per day instead)

See [BUILD-HISTORY.md](BUILD-HISTORY.md) for feature evolution.
