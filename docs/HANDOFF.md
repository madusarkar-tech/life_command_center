# Life Command Center — minimal handoff

Use this when starting a new chat or onboarding so work can continue with minimum context.

**Repo:** `~/Desktop/Scheduler` · GitHub `madusarkar-tech/life_command_center`  
**App:** single file `life-dashboard.html` (~6400 lines)  
**Live:** https://madusarkar-tech.github.io/life_command_center/life-dashboard.html  
**Local:** `python3 -m http.server 8765` → http://localhost:8765/life-dashboard.html  

> Update **HEAD** below when `main` moves.

**HEAD:** `d45ade5` on `main` · **Baseline tag:** `baseline-2026-06-10` (app `540a3a5`)

**Spec:** [DESIGN.md](./DESIGN.md) · **Baseline:** [BASELINE.md](./BASELINE.md) (tag `baseline-2026-06-10`)

---

## Architecture (don’t conflate)

| Surface | What it is |
|---------|------------|
| **Today's Flow** | Computed timeline — `buildSeq()` → `renderSched()` → `#sched`; duration-only labels + checkboxes |
| **Life Plan** | Always-visible tab — **life phases** (date ranges, archive); per-phase **default day template** (bands, default durations, gym/non-fixed defaults); **module toggles** (PMP Prep / Job Search tabs); north-star notes; syncs via `DATA.lifePlan` |
| **Today's bands** | Four bands every day; **today-only overrides** on active phase blueprint; reorder/move/duration/skip/pin; **sudden tasks (⚡)**; **open-time slots (⏳)**; Gym/Home/Skip & Extra; ⏱ end-warn; 📌 pin; capacity warnings |
| **Shift vs off** | Calendar-only — `hasWorkShift(dayKey)`: Sun–Thu = shift; Fri–Sat = off. No day-type picker. |
| **Night band** | **Shift days:** locked in bands UI (Work 8pm–3am); timeline adds Work + Sleep blocks. **Off days:** editable band 8pm–midnight, packs on timeline. |
| **Week** | Sun–Sat grid (5am–midnight); fixed-window suddens as blocks; anytime in Flex row; tap slot to add via `calEventModal` |
| **Weekly habits** | Sidebar card — `DATA.habitDaily[date]`; sleep ≥6h, workout toggle, water ≥5 glasses; Sun–Sat grid with partial progress; tap grid to log; “Log today” panel |
| **Workout log** | Full-width card below Today grid — `DATA.gymLog[date]`; yoga/cardio/lift week planner; lift detail panel (exercises, sets, weight/reps); collapsible lift disclosure (`gymLiftOpen`); monthly max/avg/sessions |
| **Tab manager** | **⋯** on tab bar — `DATA.tabUi` (`hiddenTabs`, `customTabs`); hide Week/PMP/Jobs; add custom notes-only tabs; `tabUiUpdatedAt` LWW sync; `applyTabUi()` after DATA load |
| **To-Do (Today)** | Split **Work** and **Other** lists (`list: 'work' \| 'other'` on `DATA.todos`); `mostUrgentTodo()` in now banner |
| **Band vs timeline** | Band list = intent; `packPeriodBand()` packs in band order (honors `periodPinnedStart` via `pinToMin`); open gaps → `periodOpenSlots` rows; fixed-window suddens keep clock time |
| **Open-time slots** | `dayConfig[date].periodOpenSlots` + `periodOpenSlotHidden`; keys `open:os_*` in band lists; kinds `open` (unnamed gap) vs `activity` (renamed, counts toward capacity); auto-shrink when schedule changes |
| **Sudden tasks** | `dayConfig[date].suddenTasks`; band key `sudden:st_*`; Week tab reads/writes same store |
| **Skip for today** | `periodSkips` — ✕ on band rows or timeline; **↺ unskip all tasks** in bands footer |
| **Default bands** | **Active life phase** (`resolvePhaseForDay`) → `basePeriodTemplate()`; seeded PMP prep + post-PMP job hunt on first load; legacy `periodTemplate` fallback |
| **Notes** | `todayNotes` (scratch), `pmpNotes`, `jobNotes`, `lifePlan.notes` — debounced save; first three per-field LWW |
| **Sync** | Firebase + localStorage; field-level LWW for notes + dayConfig; object LWW for `tabUi` + **`lifePlan`**; list LWW for todos, jobTodos, jobs; per-date merge for `habitDaily` + `gymLog` |

All days: morning (wake→2pm), afternoon (2–5pm), evening (5–8pm), night (8pm→midnight or locked work on shift nights).

---

## Recently shipped (since `baseline-2026-06-10`)

### Life Plan tab — Phase 1 (`d45ade5`)

- **Life Plan tab** — always visible (not in tab manager hide list)
- **Life phases** — add/edit/archive; date ranges; **active phase** resolved by calendar day
- **Seeded phases** — `phase_pmp_prep` (→ Jun 22, 2026) + `phase_job_hunt` (Jun 23 → Aug 1, 2026) on first load via `migrateLifePlan()`
- **Default day template editor** — per-phase band lists, reorder/move, default durations, gym/non-fixed defaults, add/remove built-in tasks, restore phase defaults
- **Module toggles** — ☑ PMP Prep / ☑ Job Search per phase; `isPhaseModuleEnabled()` drives tab visibility (tab manager hint: “Off in Life Plan phase”)
- **Scheduling** — `basePeriodTemplate()` reads active phase bands; `blockDurOv()` merges phase `defaultDur` with today `blockDur`; phase workout/non-fixed defaults when day has no override
- **Sync** — `DATA.lifePlan` + `lifePlanUpdatedAt` via `mergeLifePlan` (object LWW like `tabUi`)
- **Design mock** — static prototype at `docs/life-plan-mock.html` (not wired to app)

### Open-time slots + pin fixes (`b0c70fc` → `cab37ed`)

- **`periodOpenSlots`** — configurable open-time rows in Today's bands (not timeline-only Flex chips)
- **Rename / split** — set name + clock window inside open slot → remainder stays as open row; renamed slots become `activity` and count toward band capacity
- **Move / dismiss** — move between bands (times shift into target band window, e.g. 1pm morning → 2pm afternoon); ✕ dismiss stores interval in `periodOpenSlotHidden` so sync won't recreate
- **Auto-shrink** — open slots clip when neighbors change; overflow warning on activities
- **Reset today's order** — clears `periodOpenSlots` + `periodOpenSlotHidden` along with order/moves/extras
- **Pin fix** — `toMin()` on `periodPinnedStart` in `packPeriodBand`; `pinToMin()` + `normalizePeriodPins()` on load (fixes `12am` / `NaNm` on pinned gym)
- **Cross-band move** — `moveOpenSlotPeriod` shifts clock times into destination band; clears gym pin if outside target band

### Job to-do delete sync (`1a4272a`)

- **`jobTodosUpdatedAt`** — list-level LWW like work todos; deleted job to-dos stay deleted after cloud sync

### Tab manager (`7dfffe9`, fix `3304854`)

- **⋯ Manage tabs** — show/hide Week, PMP Prep, Job Search; Today always on
- **Custom tabs** — add renameable notes-only focus areas (max 12); debounced save
- **`DATA.tabUi`** + `tabUiUpdatedAt` — synced via `mergeTabUi`
- **`applyTabUi()`** — hides tabs + countdowns; switches to Today if active tab hidden
- **Startup fix** — do not call tab UI before `DATA` loads (was crashing on hard refresh)

### Workout log sync + UX (`b899d59`, `dd69a2c`, `70569b0`)

- **Per-day LWW** for `gymLog` by `updatedAt` (replaced set-union merge that duplicated sets)
- **`mergeLocal()`** prefers in-memory `DATA` during cloud apply
- Skip cloud re-render while lift inputs focused; immediate `writeLocal` on lift edits
- **Collapsible lift disclosure** — `gymLiftOpen` persisted; summary row toggles panel

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
- **`DATA.gymLog`** — `{ plan, exercises, updatedAt }` per date; `mergeGymLogMap` (LWW by `updatedAt`)
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
- **Life Plan Phase 2** — constraints editor (shift/work hours/timezone); countdowns from phase goals; onboarding templates; “apply blueprint to today”
- **Human-like gap replanning** — when suddens displace tasks, try open slots / afternoon before eviction
- **Gym spillover** — if morning band full, gym should try afternoon/evening open slots before dropping lower-priority tasks
- **`scheduleChecks`** — block checkboxes weak merge
- **Multi-user profiles** — after stable baseline
- **Google Calendar / Todoist** — later

---

## Known quirks

- Custom template extras (`custom:true`) — stepper may hit wrong branch (`c.tasks` vs `periodExtras`)
- Band cap can hide tasks; overfull still allowed; warnings surface skips
- Fixed-window sudden reorder changes **neighbor** order on timeline, not the sudden's clock time
- **Open slots vs bands** — clock time is authoritative; moving a 1pm slot to afternoon shifts to afternoon window (2–5pm), not a no-op
- **Dismissed open slots** — hidden via `periodOpenSlotHidden`; reset today's order clears them
- Alarms need tab open or browser notification permission; Web Audio may be blocked until user clicks the page
- Gym/nonFixed show “Skipped” on band row when Skip selected (workout picker), separate from `periodSkips`
- Week grid shows fixed-window suddens only in hour columns; anytime suddens in Flex row
- Legacy `weekendPeriodTemplate` / stored `dayType` in cloud data is ignored (not migrated)
- **`workoutOff`** is session-local (not synced) — prevents gym block from re-checking workout after manual un-mark on same device
- Weekly habit **%** is binary per day (goal met or not), while grid shows partial progress
- Lift panel re-renders skip when `gymLiftPanelActive()` (focused weight/reps inputs)
- **`gymLiftOpen`** syncs open/closed state for lift disclosure
- PMP tab visibility follows **Life Plan phase modules**, not only `isPmpActive()` — post-exam, turn off PMP module on job-hunt phase
- **`uiPhaseId`** selects which phase the template editor shows (may differ from today's active phase)
- **`tabUi`** must load before `applyTabUi()` — calling it in `init()` before `Store.load()` breaks startup

---

## Conventions

- Only commit/push when asked
- Minimize scope; match existing patterns in `life-dashboard.html`
- Prefer Agent mode for edits
