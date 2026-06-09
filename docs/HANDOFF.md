# Life Command Center — minimal handoff

Use this when starting a new chat or onboarding so work can continue with minimum context.

**Repo:** `~/Desktop/Scheduler` · GitHub `madusarkar-tech/life_command_center`  
**App:** single file `life-dashboard.html` (~4300 lines)  
**Live:** https://madusarkar-tech.github.io/life_command_center/life-dashboard.html  
**Local:** `python3 -m http.server 8765` → http://localhost:8765/life-dashboard.html  

> Update **HEAD** below when `main` moves.

**HEAD:** `4ba29fb` (pushed to `main`; baseline tag `baseline-2026-06-09` at app `884cd10`)

**Spec:** [DESIGN.md](./DESIGN.md) · **Baseline:** [BASELINE.md](./BASELINE.md) (tag `baseline-2026-06-09`)

---

## Architecture (don’t conflate)

| Surface | What it is |
|---------|------------|
| **Today's Flow** | Computed timeline — `buildSeq()` → `renderSched()` → `#sched`; duration-only labels + checkboxes |
| **Today's bands** | Today-only reorder/move/duration/skip in `dayConfig[date]`; **sudden tasks (⚡)** live here too; Gym/Home/Skip & Extra on band rows; ⏱ end-warn; capacity warnings |
| **Band vs timeline** | Band list = intent; `packPeriodBand()` packs in band order (including suddens); fixed-window suddens keep their clock time; anytime suddens follow band order |
| **Sudden tasks** | Stored in `dayConfig[date].suddenTasks`; band key `sudden:st_*`; linked via `periodMoves` / `periodOrder`; `repairSuddenBandLinks()` on load |
| **Skip for today** | `periodSkips` — ✕ on band rows or timeline; **↺ unskip all tasks** in bands footer |
| **Plan modal** | Weekly Fri/Sat templates in `DATA.weekendPeriodTemplate` |
| **Block lengths** | Today-only `dayConfig[date].blockDur` via −/+ on band rows |
| **Alarms** | `DATA.alarmOn` / `alarmEndOn` / `alarmEndTasks`; `checkTaskAlarms()` every 15s |
| **Sync** | Firebase + localStorage; winner-take-all base + `mergeDayConfig` + `mergeArrayFields` for todos/habits/jobs |

Workday bands: morning (wake→2pm), afternoon (2–5pm), evening (5–8pm), then Work 8pm, Sleep 3am.

---

## Recently shipped (`baseline-2026-06-09` / `884cd10`)

### Sudden ↔ bands (Step 2)

- Sudden appointments appear in **Today's bands** (⚡) with reorder, move, duration, ✕ remove
- `iterateSuddenTargetingDay` — same cross-`dayConfig` lookup as sudden list
- On add: auto `periodMoves` + `displaceSuddenOverlaps` (gym → afternoon/evening when possible)
- `packPeriodBand` packs suddens in band order; fixed-window suddens keep start/end times; neighbors reorder around them

### Skip for today (Step 1)

- `periodSkips` on `dayConfig[date]`; ✕ on every band row and timeline block
- **↺ unskip all tasks** in bands footer

### Earlier on `main` since `baseline-2026-06-08`

- `3356525` — band capacity warnings (toast, `#conflictBanner`, **· not on timeline**)
- `9c3fe45` — task alarms, inline band pickers, duration-only timeline labels
- `cc80484` — block duration −/+ on band rows

---

## Not built yet (user wants)

- **Pinned start times (Step 3)** — e.g. put gym at 11am in open time without reorder alone
- **Gym spillover** — if morning band full, gym should try afternoon/evening before dropping lower-priority tasks
- **Multi-user profiles** — after stable baseline
- **Google Calendar / Todoist** — later
- **Do NOT** replace winner-take-all for all fields

---

## Known quirks

- Custom template extras (`custom:true`) — stepper may hit wrong branch (`c.tasks` vs `periodExtras`)
- Band cap can hide tasks; overfull still allowed; warnings surface skips
- Fixed-window sudden reorder changes **neighbor** order on timeline, not the sudden's clock time
- Flex “Open time” rows have no steppers or ✕
- Alarms need tab open or browser notification permission; Web Audio may be blocked until user clicks the page
- Gym/nonFixed show “Skipped” on band row when Skip selected (workout picker), separate from `periodSkips`

---

## Conventions

- Only commit/push when asked
- Minimize scope; match existing patterns in `life-dashboard.html`
- Prefer Agent mode for edits
