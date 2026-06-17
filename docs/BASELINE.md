# Baseline checkpoint

**Established:** 2026-06-10 (current) · **Archive:** 2026-06-09 (`884cd10`)  
**Return phrase:** `Return to baseline` or `Restore baseline-2026-06-10`

Use this when you want future work (or a new chat) to treat the app as **known-good** and avoid accidental changes to sync, field-level merge, sudden/band scheduling, or Week calendar unless you explicitly ask otherwise.

**Current `main`:** `0dfc253` — weekly habits, workout log planner, split to-dos, habit logging UX. See [Changes since `baseline-2026-06-10`](#changes-since-baseline-2026-06-10-540a3a5-app) below.

## Git reference (baseline tag)

| Item | Value |
|------|--------|
| Tag | `baseline-2026-06-10` |
| App at tag | `540a3a5` — field-level sync (notes, dayConfig, todos), Week tab, pinned starts, merge-before-push, reload tie-breaks |
| Docs | Updated on `main` in the docs commit following the tag |

### Restore code to this baseline

```bash
cd ~/Desktop/Scheduler
git fetch --tags
git checkout baseline-2026-06-10
```

Restore only the app file (stay on your current branch):

```bash
git checkout baseline-2026-06-10 -- life-dashboard.html
```

List what the tag contains:

```bash
git show baseline-2026-06-10 --stat
```

**Live site:** GitHub Pages follows `main` (currently `0dfc253`).

---

## Changes since `baseline-2026-06-10` (`540a3a5` app)

| Commit | Summary |
|--------|---------|
| `0dfc253` | **Weekly habits UX** — bordered “Log today” panel; tap-to-log grid cells; partial progress labels (`3/5` water, sleep hours); live sleep input; `workoutOff` respects manual workout un-mark |
| `94a8aba` | **Today sidebar + workout log** — replaced Quick Glance with Weekly habits card; full-width Workout log (yoga/cardio/lift Sun–Sat grid + lift detail panel); split to-dos into Work vs Other; `DATA.habitDaily` + `DATA.gymLog` with per-date merge; startup `qMin` fix |
| `e3dd749` | Docs update for 4-band schedule and job sync |
| `3d15a16` | **Job pipeline delete sync** — `jobsUpdatedAt` list-level LWW (like todos); removed `mergeIdArrays` for jobs; stable `job_*` ids |
| `0fb0441` | **Unified 4-band schedule** — morning/afternoon/evening/night for all days; `hasWorkShift()` from calendar (Sun–Thu shift, Fri–Sat off); night locked on shift days; removed day picker, Weekend Plan modal, `weekendPeriodTemplate` |

---

## Changes since `baseline-2026-06-09` (`884cd10` app)

| Commit | Summary |
|--------|---------|
| `8d9882f` | **Pinned start times (Step 3)** — `periodPinnedStart`; pin UI on band rows; `packPeriodBand` honors pins; overflow packs user-added extras |
| `f4e3c79` | **Notes per-field LWW** — `todayNotes`, `pmpNotes`, `jobNotes` + `*UpdatedAt`; `mergeNoteFields`, `commitNoteField` on debounced input |
| `473bc2b` | **Week tab** — Sun–Sat grid 5am–midnight; tap slot → modal → fixed-window sudden task; Flex row for anytime suddens; `renderWeekCalendar`, `calEventModal` |
| `181363c` | **Band/schedule field-level sync** — `DAY_LWW_FIELDS` + `touchDayField`; `mergeDayEntry` / `pickDayLwwField` replace whole-day winner for those fields; **merge-before-push** in `Store.pushCloud` |
| `f3a7f74` | **Gym duration + todo deletes** — `applyBlockDurDelta` touches `blockDur`; `todos` / `jobTodos` list-level LWW via `todosUpdatedAt` / `jobTodosUpdatedAt` |
| `540a3a5` | **Reload tie-breaks** — `pickDayLwwField` / `pickListWinner` favor newer cloud field stamps on tie; `writeLocalAfterSync` sets meta `updatedAt = max(local, cloud)`; `suppressUiSave` avoids spurious save on programmatic panel open |

---

## Changes since `baseline-2026-06-08` (`9c3fe45` app)

| Commit | Summary |
|--------|---------|
| `3356525` | Band capacity warnings — `flashBandCapacityWarning`, `#conflictBanner`, **· not on timeline** |
| `aab8824` | Skip for today — `periodSkips`; ✕ on band rows + timeline |
| `2889e92` | Sudden ↔ bands — cross-day lookup; auto `periodMoves` + `displaceSuddenOverlaps` |
| `884cd10` | Band-order sudden packing; fixed-window suddens keep clock time |
| *(see above)* | Pinned starts, notes LWW, Week tab, field-level dayConfig sync, todo list LWW, merge tie-breaks |

---

## Changes since `baseline-2026-06-05` (`2f5d6b3` app)

| Commit | Summary |
|--------|---------|
| `fe372d0` | Safe per-array sync merge for `todos`, `jobTodos`, `habits`, `jobs` (superseded for todos by list LWW) |
| `9aa5ed8` | Gym `blockDur` fix; drag reorder in bands + Plan modal |
| `cc80484` | Duration edit in bands (−/+ steppers) |
| `9c3fe45` | Task alarms; inline Gym/Home/Skip + Extra pickers; duration-only timeline labels |
| *(see above)* | Capacity, skip, sudden ↔ bands, field-level sync, Week tab |

---

## What “good” means at this baseline

### Product surfaces

- **Today** — period-band schedule, Today's Flow timeline, sudden tasks, alarms, **Work / Other to-dos**, **Weekly habits** sidebar card, **Workout log** full-width card below main grid
- **Today's bands** — reorder (↑↓ / drag), move between bands, add extras, **blockDur −/+**, Gym/Home/Skip + Extra pickers, **⏱ end-warn**, **📌 pin start**, **⚡ sudden tasks**, **✕ skip for today**, capacity toast, **· not on timeline** when unpacked
- **Week** — calendar grid (Sun–Sat, 5am–midnight); tap hour → add fixed-window sudden; Flex row for anytime suddens; prev/next/today navigation
- **Weekly habits** — sleep (≥6h), workout, water (≥5 glasses); Sun–Sat grid with partial progress; tap grid to log; “Log today” panel below grid
- **Workout log** — Sun–Sat planner (yoga / cardio / lift checkboxes); lift detail panel (exercises, sets, weight/reps); monthly max/avg/sessions summary
- **PMP Prep** / **Job Search** — notes with per-field sync
- **Sync** — Google Auth + Firestore; localStorage when signed out

**Tabs:** Today · Week · PMP Prep · Job Search

> **At tag `540a3a5` only:** Weekend Plan modal + `weekendPeriodTemplate` existed. Removed on `main` at `0fb0441`.

### Mental model (do not conflate)

| Concept | Storage | Notes |
|---------|---------|--------|
| **Default bands** | `periodTemplate` (`preExam` / `postExam`) | Same defaults all days; empty `night: []`; no separate weekend template on current `main` |
| **Today's bands** | `dayConfig[date]` | `periodOrder`, `periodMoves`, `periodExtras`, `periodSkips`, `periodPinnedStart`, `blockDur`; suddens as `sudden:st_*` |
| **Sudden tasks** | `dayConfig[*].suddenTasks` | Any date bucket; `targetDayKey` selects schedule day; Week grid + bands + timeline share data |
| **Week calendar** | Read/write `suddenTasks` | Fixed-window → grid blocks; anytime → Flex chips |
| **Today's Flow** | Computed | `packPeriodBand` (honors pins) → optional `applySuddenTasks` for unpackable remainder |
| **Scratch / notes** | `todayNotes`, `pmpNotes`, `jobNotes` | Per-field LWW with `*UpdatedAt` |
| **Alarms** | `DATA.alarmOn`, `alarmEndOn`, `alarmEndTasks` | Start-of-block default on; 5m end warn per ⏱ |
| **To-Do** | `DATA.todos`, `DATA.jobTodos` | List-level LWW — whole list wins by `todosUpdatedAt` / `jobTodosUpdatedAt`; Today todos split by `list: 'work' \| 'other'` |
| **Habits (legacy)** | `DATA.habits` | Date-set union merge — still used for PMP study habit sync from schedule blocks |
| **Weekly habits** | `DATA.habitDaily[date]` | Per-date merge: max sleep/water, OR workout (`mergeHabitDailyMap`) |
| **Workout log** | `DATA.gymLog[date]` | Per-date merge: OR plan flags (yoga/cardio/lift); union exercises/sets by weight\|reps (`mergeGymLogMap`) |
| **Jobs** | `DATA.jobs` | List-level LWW at `3d15a16+` (`jobsUpdatedAt`); union merge at tag `540a3a5` only |

### Day rollover & shift inference

- Calendar “today” rolls at **4:00 AM** local (`activeDayKey()`, `DAY_ROLLOVER_HOUR = 4`).
- **Shift vs off** — `hasWorkShift(dayKey)`: Sun–Thu shift, Fri–Sat off (current `main`). Tag `540a3a5` used manual day-type picker + separate weekend templates.

---

## Sync behavior snapshot (source of truth for agents)

Implementation: `life-dashboard.html` — `Store`, `mergeAppData`, `mergeDayConfig`, `mergeDayEntry`, `mergeNoteFields`, `mergeListFields`, `mergeArrayFields`.

### Layers

| Layer | Keys / path |
|-------|-------------|
| Local | `localStorage` `lifehub:data`, `lifehub:meta` (`updatedAt`) |
| Cloud | Firestore `users/{uid}` `{ data, updatedAt }` |

### Load / save / listener

- `Store.load` → read cloud + local → `mergeAppData` → `writeLocalAfterSync`
- `Store.save` → local + debounced/urgent `pushCloud`
- `onSnapshot` → `applyRemoteData` with `suppressCloudApply` guard
- `suppressUiSave` — programmatic `<details>` open (bands, scratch, quiz) does not trigger `save()` on reload

### Top-level merge (`mergeAppData`)

Document-level winner-take-all for most scalar fields. Exceptions merged separately:

| Data | Strategy |
|------|----------|
| `dayConfig` | Per-date `mergeDayEntry` (field-level LWW) |
| `todayNotes`, `pmpNotes`, `jobNotes` | Per-field LWW (`mergeNoteFields`) |
| `todos`, `jobTodos`, `jobs` | List-level LWW (`pickListWinner`) — `jobs` added at `3d15a16` |
| `habits` | Per-habit date union |
| `habitDaily` | Per-date entry merge (`mergeHabitDailyMap`) — max sleep/water, OR workout |
| `gymLog` | Per-date entry merge (`mergeGymLogMap`) — OR plan, union lift sets |

### Per-day merge (`mergeDayEntry`)

Each field in `DAY_LWW_FIELDS` merged independently via `pickDayLwwField` + `fieldUpdatedAt` timestamps:

`wake`, `wakeLocked`, `dayType`, `workout`, `nonFixedPick`, `periodOrder`, `periodMoves`, `blockDur`, `periodSkips`, `periodPinnedStart`, `periodExtras`, `suddenTasks`

Legacy whole-day `_syncAt` still used for `tasks` / `weekendPlan` only.

**Tie-break:** higher field timestamp wins; on tie, newer document `updatedAt`; cloud wins if still tied; legacy fields without stamp use document time (not day `_syncAt`).

### Merge-before-push

`Store.pushCloud` reads cloud doc, runs `mergeAppData(local, cloud)`, then writes merged payload — prevents stale laptop push from overwriting newer iPhone field edits.

### Meta after sync

`writeLocalAfterSync` sets `lifehub:meta.updatedAt = max(localTime, cloudTime)` so reload does not treat local as newer than cloud when timestamps were equal.

---

## Scheduling engine (freeze reference)

**At tag `540a3a5`:** workday = 3 bands + Work + Sleep; weekend = 4 bands + Plan templates.

**Current `main` (`0dfc253`):** 4 bands always; `buildPeriodSeq` + `hasWorkShift`; night locked on shift days; Weekly habits + Workout log on Today tab.

- **Key functions:** `buildSeq`, `buildPeriodSeq`, `hasWorkShift`, `packPeriodBand`, `effectivePeriodLists`, `displaceSuddenOverlaps`, `applySuddenTasks`, `getPeriodPinStart`, `setPeriodPinStart`, `renderWeekCalendar`, `openCalEventModal`, `skipPeriodTask`, `repairSuddenBandLinks`, `bandCapacityStatus`, `checkTaskAlarms`, `calendarDayTypeForKey`, `activeDayKey`, `renderHabitWeekly`, `renderGymLog`, `habitTapCell`, `mergeHabitDailyMap`, `mergeGymLogMap`.

Full band windows: [DESIGN.md](./DESIGN.md).

---

## Fixes included in baseline code (`540a3a5`)

- Everything from `baseline-2026-06-09` (sudden ↔ bands, skip-for-today, capacity warnings)
- Pinned band start times + overflow packing for user extras
- Per-field sync for scratch/PMP/job notes
- Per-field sync for all band/day fields in `dayConfig`
- Week calendar tab backed by sudden tasks
- Todo list deletes sync (list-level LWW)
- Gym `blockDur` timestamp on duration change
- Merge-before-push; reload tie-break favors cloud field stamps

---

## For Cursor / new chats

> **Return to baseline.** Read `docs/BASELINE.md`. Do not change sync merge, field-level timestamps, sudden/band packing, or Week calendar unless I ask. Match tag `baseline-2026-06-10` for the frozen contract; current `main` adds 4-band unification, jobs list LWW, weekly habits, workout log, and split to-dos.

```text
When I say "return to baseline" or "restore baseline-2026-06-10", read docs/BASELINE.md and treat it as the contract. Prefer minimal diffs.
```

See [HANDOFF.md](./HANDOFF.md).

---

## Out of scope at this baseline

- Recurring calendar events
- Google Calendar / Todoist
- Multi-user `DATA.profile`
- Weak merge for `scheduleChecks` (block checkboxes)
- Gym spillover across bands when morning is full (partial: displacement on sudden add only)
- Reliable background alarms (tab/permission dependent)

---

## Archive: `baseline-2026-06-09`

Prior checkpoint before field-level sync and Week tab. App at `884cd10`.

```bash
git checkout baseline-2026-06-09 -- life-dashboard.html
```

## Archive: `baseline-2026-06-08`

App at `9c3fe45` (+ `3356525` capacity warnings on `main` before `aab8824`).

```bash
git checkout baseline-2026-06-08 -- life-dashboard.html
```

## Archive: `baseline-2026-06-05`

App at `2f5d6b3`.

```bash
git checkout baseline-2026-06-05 -- life-dashboard.html
```

## Archive: `baseline-2026-06-04`

App at `c525908`.

```bash
git checkout baseline-2026-06-04 -- life-dashboard.html
```

---

## Creating a *new* baseline later

1. Commit when code + sync behavior are right.
2. `git tag -a baseline-YYYY-MM-DD -m "description"`
3. Update this file + HANDOFF.md; push tag.
