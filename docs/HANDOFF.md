# Life Command Center — minimal handoff

Use this when starting a new chat or onboarding so work can continue with minimum context.

**Repo:** `~/Desktop/Scheduler` · GitHub `madusarkar-tech/life_command_center`  
**App:** single file `life-dashboard.html` (~3919 lines)  
**Live:** https://madusarkar-tech.github.io/life_command_center/life-dashboard.html  
**Local:** `python3 -m http.server 8765` → http://localhost:8765/life-dashboard.html  

> Update **HEAD** below when `main` moves.

**HEAD:** `9c3fe45` (baseline `baseline-2026-06-08`)

**Spec:** [DESIGN.md](./DESIGN.md) · **Baseline:** [BASELINE.md](./BASELINE.md) (tag `baseline-2026-06-08`)

---

## Architecture (don’t conflate)

| Surface | What it is |
|---------|------------|
| **Today's Flow** | Computed timeline — `buildSeq()` → `renderSched()` → `#sched`; duration-only labels + checkboxes |
| **Today's bands** | Today-only reorder/move/duration in `dayConfig[date]`; Gym/Home/Skip & Extra on band rows; ⏱ end-warn toggles |
| **Plan modal** | Weekly Fri/Sat templates in `DATA.weekendPeriodTemplate` |
| **Block lengths** | Today-only `dayConfig[date].blockDur` via −/+ on band rows (not timeline edit mode) |
| **Alarms** | `DATA.alarmOn` / `alarmEndOn` / `alarmEndTasks`; `checkTaskAlarms()` every 15s |
| **Sync** | Firebase + localStorage; winner-take-all base + `mergeDayConfig` + `mergeArrayFields` for todos/habits/jobs |

Workday bands: morning (wake→2pm), afternoon (2–5pm), evening (5–8pm), then Work 8pm, Sleep 3am.

---

## Recently shipped (`9c3fe45` / `baseline-2026-06-08`)

- **Task alarms** — start-of-block alerts (default on); optional 5m end warning via ⏱ on band rows; Alarms/End warn in Today's Flow
- **Inline band pickers** — Gym/Home/Skip on gym row; Auto/Read/AI/QGIS/Skip on non-fixed row; removed top Workout/Extra rows
- **Cleaner timeline** — Today's Flow + Right now show duration only (no `sub` hints like “1h from wake”)
- **Duration in bands** (`cc80484`) — −/+ steppers on band rows; no global “Edit block lengths”
- **Gym −/+ fix + drag reorder** (`9aa5ed8`) — `blockDur.gym` = workout minutes; ⠿ drag in bands + Plan modal

Also on `main` since older baseline: safe array sync merge (`fe372d0`), `HANDOFF.md` (`ea84a8f`).

---

## Not built yet (user wants)

- **Gym spillover** — if morning band full, gym (≥20m non-negotiable) should try afternoon/evening, optionally shift PMP, drop `nonFixed` before dropping gym
- **Multi-user profiles** — after stable baseline
- **Google Calendar / Todoist** — later
- **Do NOT** replace winner-take-all for all fields

---

## Known quirks

- Custom template extras (`custom:true`) — stepper may hit wrong branch (`c.tasks` vs `periodExtras`)
- Band cap can hide + changes when block already fills remaining room
- Flex “Open time” rows have no steppers
- Alarms need tab open or browser notification permission for background alerts
- Gym/nonFixed show “Skipped” on band row when Skip selected

---

## Conventions

- Only commit/push when asked
- Minimize scope; match existing patterns in `life-dashboard.html`
- Prefer Agent mode for edits
