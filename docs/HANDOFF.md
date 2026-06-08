# Life Command Center — minimal handoff

Use this when starting a new chat or onboarding so work can continue with minimum context.

**Repo:** `~/Desktop/Scheduler` · GitHub `madusarkar-tech/life_command_center`  
**App:** single file `life-dashboard.html` (~3743 lines)  
**Live:** https://madusarkar-tech.github.io/life_command_center/life-dashboard.html  
**Local:** `python3 -m http.server 8765` → http://localhost:8765/life-dashboard.html  

> Update **HEAD** below when `main` moves.

**HEAD:** `9aa5ed8` (pushed to `main`)

**Spec:** [DESIGN.md](./DESIGN.md) · **Baseline:** [BASELINE.md](./BASELINE.md) (tag `baseline-2026-06-05` is older; `main` is ahead)

---

## Architecture (don’t conflate)

| Surface | What it is |
|---------|------------|
| **Today's Flow** | Computed timeline — `buildSeq()` → `renderSched()` → `#sched` |
| **Today's bands** | Today-only reorder/move in `dayConfig[date].periodOrder` / `periodMoves` / `periodExtras` |
| **Plan modal** | Weekly Fri/Sat templates in `DATA.weekendPeriodTemplate` |
| **Edit block lengths** | Today-only `dayConfig[date].blockDur` via −/+ steppers |
| **Sync** | Firebase + localStorage; winner-take-all base + `mergeDayConfig` + `mergeArrayFields` for todos/habits/jobs |

Workday bands: morning (wake→2pm), afternoon (2–5pm), evening (5–8pm), then Work 8pm, Sleep 3am.

---

## Recently shipped (`9aa5ed8`)

- **Gym −/+ fix** — `blockDur.gym` = workout minutes; `gymBlockForPeriod()` honors `ov.gym`; stepper uses `applyBlockDurDelta()` / `gymWorkoutMinutesForEdit()`
- **Drag reorder** — Today's bands + weekend Plan modal (`wirePeriodTaskDrag`, ⠿ grip)

Also on `main` since baseline: safe array sync merge (`fe372d0`), empty Today's Flow fix (`planPreviewWakeMin` param rename).

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

---

## Conventions

- Only commit/push when asked
- Minimize scope; match existing patterns in `life-dashboard.html`
- Prefer Agent mode for edits
