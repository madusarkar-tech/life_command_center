# Life Command Center — minimal handoff

Use this when starting a new chat or onboarding so work can continue with minimum context.

**Repo:** `~/Desktop/Scheduler` · GitHub `madusarkar-tech/life_command_center`  
**App:** single file `life-dashboard.html` (~5000 lines)  
**Live:** https://madusarkar-tech.github.io/life_command_center/life-dashboard.html  
**Local:** `python3 -m http.server 8765` → http://localhost:8765/life-dashboard.html  

> Update **HEAD** below when `main` moves.

**HEAD:** `0dfc253` on `main` · **Baseline tag:** `baseline-2026-06-10` (app `540a3a5`)

**Spec:** [DESIGN.md](./DESIGN.md) · **Baseline:** [BASELINE.md](./BASELINE.md) (tag `baseline-2026-06-10`)

---

## Architecture (don’t conflate)

| Surface | What it is |
|---------|------------|
| **Today's Flow** | Computed timeline — `buildSeq()` → `renderSched()` → `#sched`; duration-only labels + checkboxes |
| **Today's bands** | Four bands every day; today-only reorder/move/duration/skip/pin in `dayConfig[date]`; **sudden tasks (⚡)**; Gym/Home/Skip & Extra on band rows; ⏱ end-warn; 📌 pin start; capacity warnings |
| **Shift vs off** | Calendar-only — `hasWorkShift(dayKey)`: Sun–Thu = shift; Fri–Sat = off. No day-type picker. |
| **Night band** | **Shift days:** locked in bands UI (Work 8pm–3am); timeline adds Work + Sleep blocks. **Off days:** editable band 8pm–midnight, packs on timeline. |
| **Week** | Sun–Sat grid (5am–midnight); fixed-window suddens as blocks; anytime in Flex row; tap slot to add via `calEventModal` |
| **Weekly habits** | Sidebar card — `DATA.habitDaily[date]`; sleep ≥6h, workout toggle, water ≥5 glasses; Sun–Sat grid with partial progress; tap grid to log; “Log today” panel |
| **Workout log** | Full-width card below Today grid — `DATA.gymLog[date]`; yoga/cardio/lift week planner; lift detail panel (exercises, sets, weight/reps); monthly max/avg/sessions |
| **To-Do (Today)** | Split **Work** and **Other** lists (`list: 'work' \| 'other'` on `DATA.todos`); `mostUrgentTodo()` in now banner |
| **Band vs timeline** | Band list = intent; `packPeriodBand()` packs in band order (honors `periodPinnedStart`); fixed-window suddens keep clock time |
| **Sudden tasks** | `dayConfig[date].suddenTasks`; band key `sudden:st_*`; Week tab reads/writes same store |
| **Skip for today** | `periodSkips` — ✕ on band rows or timeline; **↺ unskip all tasks** in bands footer |
| **Default bands** | Single model — `periodTemplate` preExam/postExam + hardcoded defaults; empty `night: []` by default |
| **Notes** | `todayNotes` (scratch), `pmpNotes`, `jobNotes` — each field has own `*UpdatedAt` |
| **Sync** | Firebase + localStorage; field-level LWW for notes + dayConfig; list LWW for todos, jobTodos, **jobs**; per-date merge for `habitDaily` + `gymLog` |

All days: morning (wake→2pm), afternoon (2–5pm), evening (5–8pm), night (8pm→midnight or locked work on shift nights).

---

## Recently shipped (since `baseline-2026-06-10`)

### Weekly habits UX (`0dfc253`)

- Bordered **“Log today”** panel (replaces easy-to-miss gray “Edit · Today” label)
- **Tap grid to log** — water +1, workout toggle, sleep selects day + focuses input
- **Partial progress in grid** — e.g. `3/5` water, sleep hours until goal, then `✓`
- Live sleep input (`oninput` + debounced save) without losing focus
- **`workoutOff`** — manual workout un-mark is not overridden by gym schedule block auto-sync

### Weekly habits + workout log + split to-dos (`94a8aba`)

- **Removed Quick Glance** — replaced with Weekly habits sidebar card
- **`DATA.habitDaily`** — `{ sleepHrs, workout, water }` per date; `mergeHabitDailyMap`
- **Workout log** — Sun–Sat yoga/cardio/lift grid; lift logging in detail panel; monthly lift stats (max, avg, sessions)
- **`DATA.gymLog`** — `{ plan, exercises, updatedAt }` per date; `mergeGymLogMap`
- **Split to-dos** — Work vs Other on Today (`list` field; legacy items default `other`)
- Fixed startup crash from leftover Quick Glance `qMin` reference in `wire()`

### Unified 4-band schedule (`0fb0441`)

- **Four bands everywhere** — morning, afternoon, evening, night for all calendar days
- **Shift nights (Sun–Thu)** — night band locked; Work 8pm–3am + Sleep 3am→wake on timeline only
- **Off nights (Fri–Sat)** — night band editable like other bands; packs 8pm→midnight
- **Removed** — day-type picker, Weekend Plan modal, `weekendPeriodTemplate`, separate Fri/Sat defaults
- **Calendar inference** — `hasWorkShift()` from date; no manual Auto/Workday/Friday/Saturday override

### Job pipeline delete sync (`3d15a16`)

- **`jobsUpdatedAt`** — list-level LWW like todos; removed applications stay deleted after cloud sync
- Stable `job_*` ids on create; legacy jobs get ids on load via `migrateData`

### Baseline (`540a3a5` / tag `baseline-2026-06-10`)

- Per-field dayConfig merge, notes LWW, todo list LWW, merge-before-push, reload tie-breaks
- Week tab, pinned starts, sudden ↔ bands, skip-for-today, capacity warnings

---

## Not built yet (user wants)

- **Recurring calendar events**
- **Gym spillover** — if morning band full, gym should try afternoon/evening before dropping lower-priority tasks
- **`scheduleChecks`** — block checkboxes weak merge
- **Multi-user profiles** — after stable baseline
- **Google Calendar / Todoist** — later

---

## Known quirks

- Custom template extras (`custom:true`) — stepper may hit wrong branch (`c.tasks` vs `periodExtras`)
- Band cap can hide tasks; overfull still allowed; warnings surface skips
- Fixed-window sudden reorder changes **neighbor** order on timeline, not the sudden's clock time
- Flex “Open time” rows have no steppers or ✕
- Alarms need tab open or browser notification permission; Web Audio may be blocked until user clicks the page
- Gym/nonFixed show “Skipped” on band row when Skip selected (workout picker), separate from `periodSkips`
- Week grid shows fixed-window suddens only in hour columns; anytime suddens in Flex row
- Legacy `weekendPeriodTemplate` / stored `dayType` in cloud data is ignored (not migrated)
- **`workoutOff`** is session-local (not synced) — prevents gym block from re-checking workout after manual un-mark on same device
- Weekly habit **%** is binary per day (goal met or not), while grid shows partial progress

---

## Conventions

- Only commit/push when asked
- Minimize scope; match existing patterns in `life-dashboard.html`
- Prefer Agent mode for edits
