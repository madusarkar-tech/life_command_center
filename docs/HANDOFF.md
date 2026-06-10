# Life Command Center — minimal handoff

Use this when starting a new chat or onboarding so work can continue with minimum context.

**Repo:** `~/Desktop/Scheduler` · GitHub `madusarkar-tech/life_command_center`  
**App:** single file `life-dashboard.html` (~4900 lines)  
**Live:** https://madusarkar-tech.github.io/life_command_center/life-dashboard.html  
**Local:** `python3 -m http.server 8765` → http://localhost:8765/life-dashboard.html  

> Update **HEAD** below when `main` moves.

**HEAD:** `540a3a5` on `main` · **Baseline tag:** `baseline-2026-06-10` (app `540a3a5`)

**Spec:** [DESIGN.md](./DESIGN.md) · **Baseline:** [BASELINE.md](./BASELINE.md) (tag `baseline-2026-06-10`)

---

## Architecture (don’t conflate)

| Surface | What it is |
|---------|------------|
| **Today's Flow** | Computed timeline — `buildSeq()` → `renderSched()` → `#sched`; duration-only labels + checkboxes |
| **Today's bands** | Today-only reorder/move/duration/skip/pin in `dayConfig[date]`; **sudden tasks (⚡)** live here too; Gym/Home/Skip & Extra on band rows; ⏱ end-warn; 📌 pin start; capacity warnings |
| **Week** | Sun–Sat grid (5am–midnight); fixed-window suddens as blocks; anytime in Flex row; tap slot to add via `calEventModal` |
| **Band vs timeline** | Band list = intent; `packPeriodBand()` packs in band order (honors `periodPinnedStart`); fixed-window suddens keep clock time |
| **Sudden tasks** | `dayConfig[date].suddenTasks`; band key `sudden:st_*`; Week tab reads/writes same store |
| **Skip for today** | `periodSkips` — ✕ on band rows or timeline; **↺ unskip all tasks** in bands footer |
| **Plan modal** | Weekly Fri/Sat templates in `DATA.weekendPeriodTemplate` |
| **Notes** | `todayNotes` (scratch), `pmpNotes`, `jobNotes` — each field has own `*UpdatedAt` |
| **Sync** | Firebase + localStorage; field-level LWW for notes + dayConfig; list LWW for todos |

Workday bands: morning (wake→2pm), afternoon (2–5pm), evening (5–8pm), then Work 8pm, Sleep 3am.

---

## Recently shipped (`baseline-2026-06-10` / `540a3a5`)

### Sync hardening

- **Per-field dayConfig merge** — `DAY_LWW_FIELDS` + `touchDayField`; no more whole-day winner wiping band edits from another device
- **Notes LWW** — scratch, PMP, job notes merge independently
- **Todo list LWW** — `todosUpdatedAt` / `jobTodosUpdatedAt`; deletes stick
- **Merge-before-push** — `pushCloud` reads cloud, merges, then writes
- **Reload tie-breaks** — cloud field stamps win on tie; `writeLocalAfterSync` preserves max(local, cloud) meta

### Week tab (`473bc2b`)

- Calendar grid Sun–Sat, hours 5am–midnight
- Tap hour → modal → fixed-window sudden task
- Anytime suddens in Flex row above grid

### Pinned starts (`8d9882f`)

- `periodPinnedStart` on band rows (📌)
- `packPeriodBand` places pinned tasks at clock time within band

### Earlier since `baseline-2026-06-09`

- Sudden ↔ bands, skip-for-today, capacity warnings (`884cd10` and prior)

---

## Not built yet (user wants)

- **Recurring calendar events**
- **Gym spillover** — if morning band full, gym should try afternoon/evening before dropping lower-priority tasks
- **Jobs delete sync** — `jobs` still union merge (`mergeIdArrays`)
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

---

## Conventions

- Only commit/push when asked
- Minimize scope; match existing patterns in `life-dashboard.html`
- Prefer Agent mode for edits
