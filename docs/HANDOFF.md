# Life Command Center — minimal handoff

Use this when starting a new chat or onboarding so work can continue with minimum context.

**Repo:** `~/Desktop/Scheduler` · GitHub `madusarkar-tech/life_command_center`  
**App:** single file `life-dashboard.html` (~3960 lines)  
**Live:** https://madusarkar-tech.github.io/life_command_center/life-dashboard.html  
**Local:** `python3 -m http.server 8765` → http://localhost:8765/life-dashboard.html  

> Update **HEAD** below when `main` moves.

**HEAD:** `3356525` (pushed to `main`; baseline tag `baseline-2026-06-08` at `9c3fe45`)

**Spec:** [DESIGN.md](./DESIGN.md) · **Baseline:** [BASELINE.md](./BASELINE.md) (tag `baseline-2026-06-08`; `main` is ahead)

---

## Architecture (don’t conflate)

| Surface | What it is |
|---------|------------|
| **Today's Flow** | Computed timeline — `buildSeq()` → `renderSched()` → `#sched`; duration-only labels + checkboxes |
| **Today's bands** | Today-only reorder/move/duration in `dayConfig[date]`; Gym/Home/Skip & Extra on band rows; ⏱ end-warn toggles; **capacity warnings** on add/move |
| **Band vs timeline** | Band list = intent; `packPeriodBand()` builds timeline — overfull bands may show tasks **· not on timeline** + `#conflictBanner` |
| **Plan modal** | Weekly Fri/Sat templates in `DATA.weekendPeriodTemplate` |
| **Block lengths** | Today-only `dayConfig[date].blockDur` via −/+ on band rows (not timeline edit mode) |
| **Alarms** | `DATA.alarmOn` / `alarmEndOn` / `alarmEndTasks`; `checkTaskAlarms()` every 15s |
| **Sync** | Firebase + localStorage; winner-take-all base + `mergeDayConfig` + `mergeArrayFields` for todos/habits/jobs |

Workday bands: morning (wake→2pm), afternoon (2–5pm), evening (5–8pm), then Work 8pm, Sleep 3am.

---

## Recently shipped

### `3356525` (latest on `main`)

- **Band capacity warnings** — toast when add/move overfills a band (`flashBandCapacityWarning`, `bandCapacityStatus`); `#conflictBanner` + **· not on timeline** on band rows when `packPeriodBand` skips tasks (`skippedBandConflicts`, `lastSkippedBandTasks`)

### `baseline-2026-06-08` (`9c3fe45`)

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
- Band cap can hide + changes when block already fills remaining room (overfull still allowed; warnings now surface skips)
- Flex “Open time” rows have no steppers
- Alarms need tab open or browser notification permission for background alerts; short Web Audio beep (~880 Hz) may be blocked until user clicks the page
- Gym/nonFixed show “Skipped” on band row when Skip selected
- Tasks in a band list can exceed band window — skipped tasks show **· not on timeline**; shorten durations or move tasks

---

## Conventions

- Only commit/push when asked
- Minimize scope; match existing patterns in `life-dashboard.html`
- Prefer Agent mode for edits
