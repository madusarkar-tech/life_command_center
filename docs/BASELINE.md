# Baseline checkpoint

**Established:** 2026-06-24 (current) · **Archive:** 2026-06-10 (`540a3a5` app at tag)  
**Return phrase:** `Return to baseline` or `Restore baseline-2026-06-24`

Use this when you want future work (or a new chat) to treat the app as **known-good** and avoid accidental changes to sync, field-level merge, sudden/band scheduling, or Week calendar unless you explicitly ask otherwise.

**Current `main`:** `a5f1f09` (docs) · **App at baseline tag:** `4d596e9` — weekly habits sleep sync hardening. See [Changes since `baseline-2026-06-24`](#changes-since-baseline-2026-06-24-4d596e9-app) below.

## Git reference (baseline tag)

| Item | Value |
|------|--------|
| Tag | `baseline-2026-06-24` |
| App at tag | `4d596e9` — Life Plan Phase 1 + open-time slots + pin fixes + tab manager + workout log LWW + **habit sleep sync** (`sleepHrsUpdatedAt`, `patchHabitSleepFromSource`, `habitSleepInputActive`) |
| Docs | Updated on `main` in the docs commit following the tag |

### Restore code to this baseline

```bash
cd ~/Projects/life-command-center
git fetch --tags
git checkout baseline-2026-06-24
```

Restore only the app file (stay on your current branch):

```bash
git checkout baseline-2026-06-24 -- life-dashboard.html
```

List what the tag contains:

```bash
git show baseline-2026-06-24 --stat
```

**Live site:** GitHub Pages follows `main` (currently `a5f1f09`; app baseline `4d596e9`).

---

## Changes since `baseline-2026-06-24` (`4d596e9` app)

| Commit | Summary |
|--------|---------|
| `a5f1f09` | Docs update for `baseline-2026-06-24` (habit sleep sync contract) |

---

## Changes since `baseline-2026-06-10` (`540a3a5` app)

| Commit | Summary |
|--------|---------|
| `4d596e9` | **Habit sleep sync hardening** — `sleepHrsUpdatedAt` LWW (separate from water/workout `updatedAt`); `commitSleepHrs(dayKey,…)` fresh lookup (no stale closure); `patchHabitSleepFromSource` on load/push/snapshot; `mergeLocal()` prefers in-memory `habitDaily` + `sleepHrsUpdatedAt`; `habitSleepInputActive()` skips remote apply + full habit re-render; urgent push on sleep; panel label **(not today)** when editing another column |
| `e282320` | **Habit sleep revert fix** — replaced `Math.max` sleep merge with per-day LWW; immediate `writeLocal` on sleep input; `mergeLocal()` habitDaily preference |
| `d7dcdea` | Docs update for Life Plan Phase 1 |
| `d45ade5` | **Life Plan tab (Phase 1)** — life phases with date ranges; per-phase default band template editor; PMP/Job **module toggles**; `DATA.lifePlan` + `mergeLifePlan`; `basePeriodTemplate()` reads active phase; `blockDurOv` merges phase `defaultDur` |
| `8e5500b` | Docs update for open-time slots and pin fixes |
| `cab37ed` | **Cross-band open-slot move** — shifting times into target band window (e.g. workout 1pm → afternoon at 2pm); clears gym pin outside destination band |
| `8e320cb` | **Open-slot dismiss** — `periodOpenSlotHidden` so ✕ on open time persists (sync no longer recreates dismissed gaps) |
| `0f04f43` | **Open-slot band UI** — single-row layout (name + times + duration inline) |
| `1c9934e` | **Configurable open-time slots** — `periodOpenSlots` in bands; rename/split/move; auto-shrink; activity slots count toward band capacity |
| `c2e2815` | **Pin hardening** — `pinToMin()` + `normalizePeriodPins()` for invalid stored pin values |
| `b0c70fc` | **Pin fix** — `packPeriodBand` uses `toMin()` on `periodPinnedStart` (fixes `12am` / `NaNm` timeline rows) |
| `1a4272a` | **Job to-do delete sync** — `jobTodosUpdatedAt` list-level LWW (like work todos) |
| `ef49a4c` | Docs update for tab manager, workout log sync, lift disclosure |
| `3304854` | **Tab manager startup fix** — `applyTabUi()` only after `DATA` loads; null guards on `isTabVisible` / `isTabHidden` |
| `7dfffe9` | **Tab manager** — hide Week/PMP/Jobs; custom notes-only tabs; `DATA.tabUi` + `mergeTabUi`; **⋯** modal |
| `b899d59` | **Lift log disclosure** — collapsible lift panel; `gymLiftOpen` persisted |
| `dd69a2c` | **Workout log sync stability** — `mergeLocal()` prefers in-memory `DATA`; skip re-render while lift focused; immediate local write on lift edits |
| `70569b0` | **Workout log LWW** — per-day `gymLog` merge by `updatedAt` (fixes duplicate sets / resurrected deletes when signed in) |
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
- **Today's bands** — reorder (↑↓ / drag), move between bands, add extras, **blockDur −/+**, Gym/Home/Skip + Extra pickers, **⏱ end-warn**, **📌 pin start**, **⚡ sudden tasks**, **⏳ open-time slots** (rename, clock window, move, dismiss), **✕ skip for today**, capacity toast, **· not on timeline** when unpacked
- **Week** — calendar grid (Sun–Sat, 5am–midnight); tap hour → add fixed-window sudden; Flex row for anytime suddens; prev/next/today navigation
- **Weekly habits** — sleep (≥6h), workout, water (≥5 glasses); Sun–Sat grid with partial progress; tap grid to log; “Log today” panel below grid
- **Workout log** — Sun–Sat planner (yoga / cardio / lift checkboxes); lift detail panel (exercises, sets, weight/reps); collapsible lift disclosure; monthly max/avg/sessions summary
- **Life Plan** — life phases (date ranges, archive); per-phase **default day template** (bands + default durations + gym/non-fixed defaults); **module toggles** for PMP Prep / Job Search tabs; north-star notes; always visible tab
- **PMP Prep** / **Job Search** — notes with per-field sync; visibility from Life Plan phase modules + tab manager hide
- **Custom tabs** — notes-only focus areas added via **⋯** tab manager
- **Sync** — Google Auth + Firestore; localStorage when signed out

**Tabs:** Today · Week · **Life Plan** · PMP Prep · Job Search · *(optional custom tabs)* · **⋯** to manage visibility (Life Plan and Today always on)

> **At tag `540a3a5` only:** Weekend Plan modal + `weekendPeriodTemplate` existed. Removed on `main` at `0fb0441`.

### Mental model (do not conflate)

| Concept | Storage | Notes |
|---------|---------|--------|
| **Life Plan (blueprint)** | `DATA.lifePlan` | `phases[]` with `bands`, `defaultDur`, `defaultWorkout`, `defaultNonFixedPick`, `modules` (`pmp`, `jobs`), `start`/`end`, `archived`; `uiPhaseId`; `notes`; object LWW via `lifePlanUpdatedAt` |
| **Default bands** | Active **life phase** → `basePeriodTemplate()` | Seeded: PMP prep (→ Jun 22) + post-PMP job hunt (Jun 23 → Aug 1); legacy `periodTemplate` fallback if no phases |
| **Today's bands** | `dayConfig[date]` | Today-only overrides on top of active phase blueprint; `periodOrder`, `periodMoves`, … |
| **Open-time slots** | `dayConfig[date].periodOpenSlots` | Per-band `{ id, kind: 'open'\|'activity', name, start, end, auto? }`; gaps auto-sync; dismiss → `periodOpenSlotHidden` |
| **Sudden tasks** | `dayConfig[*].suddenTasks` | Any date bucket; `targetDayKey` selects schedule day; Week grid + bands + timeline share data |
| **Week calendar** | Read/write `suddenTasks` | Fixed-window → grid blocks; anytime → Flex chips |
| **Today's Flow** | Computed | `packPeriodBand` (honors pins) → `syncPeriodOpenSlotsForBand` → optional `applySuddenTasks` for unpackable remainder |
| **Scratch / notes** | `todayNotes`, `pmpNotes`, `jobNotes` | Per-field LWW with `*UpdatedAt` |
| **Alarms** | `DATA.alarmOn`, `alarmEndOn`, `alarmEndTasks` | Start-of-block default on; 5m end warn per ⏱ |
| **To-Do** | `DATA.todos`, `DATA.jobTodos` | List-level LWW — whole list wins by `todosUpdatedAt` / `jobTodosUpdatedAt`; Today todos split by `list: 'work' \| 'other'` |
| **Habits (legacy)** | `DATA.habits` | Date-set union merge — still used for PMP study habit sync from schedule blocks |
| **Weekly habits** | `DATA.habitDaily[date]` | Per-date merge (`mergeHabitDailyMap`): **sleep** LWW on `sleepHrsUpdatedAt`; max water; OR workout; `patchHabitSleepFromSource` on load/push/snapshot |
| **Workout log** | `DATA.gymLog[date]` | Per-date LWW by `updatedAt` — whole day entry wins (`mergeGymLogMap`) |
| **tabUi** | `DATA.tabUi` | Object-level LWW by `tabUiUpdatedAt` — hide Week/PMP/Jobs (not Life Plan); custom tabs (`mergeTabUi`) |
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
- `onSnapshot` → `applyRemoteData` with `suppressCloudApply` guard; skipped while `gymLiftPanelActive()` or `habitSleepInputActive()`
- `suppressUiSave` — programmatic `<details>` open (bands, scratch, quiz) does not trigger `save()` on reload

### Top-level merge (`mergeAppData`)

Document-level winner-take-all for most scalar fields. Exceptions merged separately:

| Data | Strategy |
|------|----------|
| `dayConfig` | Per-date `mergeDayEntry` (field-level LWW) |
| `todayNotes`, `pmpNotes`, `jobNotes` | Per-field LWW (`mergeNoteFields`) |
| `tabUi` | Object-level LWW (`mergeTabUi` on `tabUiUpdatedAt`) |
| `lifePlan` | Object-level LWW (`mergeLifePlan` on `lifePlanUpdatedAt`) |
| `todos`, `jobTodos`, `jobs` | List-level LWW (`pickListWinner`) — `jobs` added at `3d15a16` |
| `habits` | Per-habit date union |
| `habitDaily` | Per-date merge (`mergeHabitDailyMap`) — **sleep** LWW on `sleepHrsUpdatedAt` (`habitSleepTs`); max water; OR workout; `patchHabitSleepFromSource` after merge; `mergeLocal()` prefers in-memory entries when `updatedAt` / `sleepHrsUpdatedAt` newer |
| `gymLog` | Per-date LWW by `updatedAt` (`mergeGymLogMap`) — whole day wins; tie → document time |

### Per-day merge (`mergeDayEntry`)

Each field in `DAY_LWW_FIELDS` merged independently via `pickDayLwwField` + `fieldUpdatedAt` timestamps:

`wake`, `wakeLocked`, `dayType`, `workout`, `nonFixedPick`, `periodOrder`, `periodMoves`, `blockDur`, `periodSkips`, `periodPinnedStart`, `periodExtras`, `periodOpenSlots`, `periodOpenSlotHidden`, `suddenTasks`

Legacy whole-day `_syncAt` still used for `tasks` / `weekendPlan` only.

**Tie-break:** higher field timestamp wins; on tie, newer document `updatedAt`; cloud wins if still tied; legacy fields without stamp use document time (not day `_syncAt`).

### Merge-before-push

`Store.pushCloud` reads cloud doc, runs `mergeAppData(local, cloud)`, **`patchHabitSleepFromSource`**, then writes merged payload — prevents stale laptop push from overwriting newer iPhone field edits.

### Meta after sync

`writeLocalAfterSync` sets `lifehub:meta.updatedAt = max(localTime, cloudTime)` so reload does not treat local as newer than cloud when timestamps were equal.

---

## Scheduling engine (freeze reference)

**At tag `540a3a5`:** workday = 3 bands + Work + Sleep; weekend = 4 bands + Plan templates.

**Current `main` (`4d596e9`):** 4 bands always; **Life Plan** phases; open-time slots; pin fixes; Weekly habits + Workout log; tab manager; **habit sleep sync** (`sleepHrsUpdatedAt`, focus guards).

- **Key functions:** `buildSeq`, `buildPeriodSeq`, `hasWorkShift`, `packPeriodBand`, `basePeriodTemplate`, `resolvePhaseForDay`, `isPhaseModuleEnabled`, `renderLifePlan`, `renderBlueprintBands`, `mergeLifePlan`, `migrateLifePlan`, `effectivePeriodLists`, `syncPeriodOpenSlotsForBand`, `moveOpenSlotPeriod`, `pinToMin`, `displaceSuddenOverlaps`, `applySuddenTasks`, `renderWeekCalendar`, `applyTabUi`, `mergeTabUi`, `isTabVisible`, `mergeHabitDailyMap`, `patchHabitSleepFromSource`, `commitSleepHrs`, `habitSleepInputActive`.

Full band windows: [DESIGN.md](./DESIGN.md).

---

## Fixes included in baseline code (`4d596e9`)

- Everything from tag `baseline-2026-06-10` (Life Plan, open slots, pins, tab manager, workout log LWW, weekly habits UX, 4-band schedule, jobs/jobTodos list LWW)
- **Habit sleep sync** — `sleepHrsUpdatedAt` per date; sleep LWW separate from water/workout bumps; `commitSleepHrs` resolves entry by `dayKey`; `patchHabitSleepFromSource` on load/push/snapshot; `habitSleepInputActive()` + `mergeLocal()` habitDaily preference; urgent cloud push on sleep edit

---

## Fixes included in baseline code (`540a3a5`) — archive

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

> **Return to baseline.** Read `docs/BASELINE.md`. Do not change sync merge, field-level timestamps, habit sleep LWW (`sleepHrsUpdatedAt`), Life Plan phase/blueprint logic, sudden/band packing, open-slot sync, or Week calendar unless I ask. Match tag `baseline-2026-06-24` for the frozen contract.

```text
When I say "return to baseline" or "restore baseline-2026-06-24", read docs/BASELINE.md and treat it as the contract. Prefer minimal diffs.
```

See [HANDOFF.md](./HANDOFF.md).

---

## Out of scope at this baseline

- Recurring calendar events
- Google Calendar / Todoist
- Multi-user `DATA.profile`
- Life Plan **constraints** editor (shift days, work hours, timezone still hardcoded)
- Life Plan **countdown cards** driven by phase goals (still use `PMP` / `JOB` constants)
- Onboarding template picker for new users
- Weak merge for `scheduleChecks` (block checkboxes)
- **Human-like gap replanning** — auto-place displaced gym/PMP/job into open slots before eviction (see DESIGN.md planning notes)
- Gym spillover across bands when morning is full (partial: sudden displacement + open slots; no full replan loop)
- Reliable background alarms (tab/permission dependent)

---

## Archive: `baseline-2026-06-10`

Prior checkpoint before habit sleep sync hardening. App at `540a3a5`.

```bash
git checkout baseline-2026-06-10 -- life-dashboard.html
```

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
