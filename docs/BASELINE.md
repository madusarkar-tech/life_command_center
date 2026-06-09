# Baseline checkpoint

**Established:** 2026-06-09 (current) · **Archive:** 2026-06-08 (`9c3fe45`)  
**Return phrase:** `Return to baseline` or `Restore baseline-2026-06-09`

Use this when you want future work (or a new chat) to treat the app as **known-good** and avoid accidental changes to sync, sudden/band scheduling, or weekend Plan behavior unless you explicitly ask otherwise.

## Git reference (current)

| Item | Value |
|------|--------|
| Tag | `baseline-2026-06-09` |
| App at tag | `884cd10` — sudden ↔ bands sync, skip-for-today, band-order sudden packing |
| Docs | Updated on `main` in the docs commit following the tag |

### Restore code to this baseline

```bash
cd ~/Desktop/Scheduler
git fetch --tags
git checkout baseline-2026-06-09
```

Restore only the app file (stay on your current branch):

```bash
git checkout baseline-2026-06-09 -- life-dashboard.html
```

List what the tag contains:

```bash
git show baseline-2026-06-09 --stat
```

**Live site:** GitHub Pages follows `main` (currently `4ba29fb`; app at tag `884cd10`).

---

## Changes since `baseline-2026-06-08` (`9c3fe45` app)

| Commit | Summary |
|--------|---------|
| `3356525` | **Band capacity warnings** — `flashBandCapacityWarning` / `bandCapacityStatus`; `skippedBandTasks`; `#conflictBanner`; **· not on timeline** (`pt-unpacked`). Syntax fix in conflict message. |
| `aab8824` | **Skip for today** — `periodSkips`; ✕ on band rows + timeline; **↺ unskip all tasks**. |
| `2889e92` | **Sudden ↔ bands** — suddens in `effectivePeriodLists` as `sudden:st_*`; cross-`dayConfig` lookup (`iterateSuddenTargetingDay`); auto `periodMoves` + `displaceSuddenOverlaps` on add; `repairSuddenBandLinks` on load. |
| `884cd10` | **Band-order sudden packing** — `packPeriodBand` packs suddens in band order; fixed-window suddens keep clock time; `suddenTasksNotInSeq` avoids double-apply in `applySuddenTasks`. |

---

## Changes since `baseline-2026-06-05` (`2f5d6b3` app)

| Commit | Summary |
|--------|---------|
| `fe372d0` | Safe per-array sync merge for `todos`, `jobTodos`, `habits`, `jobs` |
| `9aa5ed8` | Gym `blockDur` fix; drag reorder in bands + Plan modal |
| `ea84a8f` | `HANDOFF.md` |
| `cc80484` | Duration edit in bands (−/+ steppers) |
| `9c3fe45` | Task alarms; inline Gym/Home/Skip + Extra pickers; duration-only timeline labels |
| *(see above)* | Capacity warnings, skip-for-today, sudden ↔ bands |

---

## Changes since `baseline-2026-06-04` (`c525908` app)

| Commit | Summary |
|--------|---------|
| `e222fd8` | Auto day type uses `activeDayKey()` calendar |
| `2f5d6b3` | Habits on Today Quick Glance only (tab removed) |
| `e3dfb74` | Docs only — scheduling flowcharts |

**Unchanged since 2026-06-04:** weekend Plan modal guard, period-band engine core, `planPreviewWakeMin(forDayType)`. Sync: document-level winner-take-all **base**; `dayConfig` + array fields merged separately.

---

## What “good” means at this baseline

### Product surfaces

- **Today** — period-band schedule, Today's Flow timeline, sudden tasks, alarms, to-dos, habit chips
- **Today's bands** — reorder (↑↓ / drag), move between bands, add extras, **blockDur −/+**, Gym/Home/Skip + Extra pickers, **⏱ end-warn**, **⚡ sudden tasks**, **✕ skip for today**, capacity toast, **· not on timeline** when unpacked
- **Quick Glance** — block checks, habit chips, study shortcuts
- **PMP Prep** / **Job Search** — unchanged
- **Weekend Plan modal** — weekly Fri/Sat templates; drafts until Save; drag reorder
- **Sync** — Google Auth + Firestore; localStorage when signed out

**Tabs:** Today · PMP Prep · Job Search

### Mental model (do not conflate)

| Concept | Storage | Notes |
|---------|---------|--------|
| **Plan** | `weekendPeriodTemplate` + modal drafts | Weekly Fri/Sat; Save only |
| **Today's bands** | `dayConfig[date]` | `periodOrder`, `periodMoves`, `periodExtras`, `periodSkips`, `blockDur`; suddens as `sudden:st_*` keys |
| **Sudden tasks** | `dayConfig[*].suddenTasks` | May live in any date bucket; `targetDayKey` selects schedule day; bands + timeline share packing |
| **Today's Flow** | Computed | `packPeriodBand` → optional `applySuddenTasks` for unpackable remainder |
| **Alarms** | `DATA.alarmOn`, `alarmEndOn`, `alarmEndTasks` | Start-of-block default on; 5m end warn per ⏱ |
| **To-Do** | `DATA.todos` | Sidebar |
| **Habits** | `DATA.habits` + Today chips | No dedicated tab |

### Day rollover & Auto day type

- Calendar “today” rolls at **4:00 AM** local (`activeDayKey()`, `DAY_ROLLOVER_HOUR = 4`).
- **Auto** uses `calendarDayTypeForKey(activeDayKey())`, not wall-clock `getDay()`.

---

## Sync behavior snapshot (source of truth for agents)

Implementation: `life-dashboard.html` — `Store`, `mergeAppData`, `mergeDayConfig`, `mergeArrayFields`.

**Unchanged since `fe372d0`.** New day fields (`periodSkips`, sudden `periodMoves`) live inside `dayConfig` and merge per-day.

### Layers

| Layer | Keys / path |
|-------|-------------|
| Local | `localStorage` `lifehub:data`, `lifehub:meta` |
| Cloud | Firestore `users/{uid}` `{ data, updatedAt }` |

### Load / save / listener

Same as prior baseline: `Store.load` → `mergeAppData`; `Store.save` → local + debounced/urgent `pushCloud`; `onSnapshot` with `suppressCloudApply` and weekend Plan modal guard.

### Top-level merge (`mergeAppData`)

Winner-take-all by document timestamp; exceptions: `dayConfig` (per-date merge), `todos`/`jobTodos`/`habits`/`jobs` (`mergeArrayFields`).

### Per-day merge (`mergeDayConfig`)

Newer `dayConfig[date]._syncAt` wins; `suddenTasks` union by id; `periodSkips`/`periodMoves`/`periodOrder`/`periodExtras` on winning day entry.

### Weekend Plan modal guard

`isWeekendPlanModalOpen()` blocks `applyRemoteData` while modal open.

---

## Scheduling engine (freeze reference)

- **Workday:** 3 bands + Work (8pm–3am) + Sleep (3am→wake).
- **Weekend:** 4 bands through night (8pm–midnight).
- **Key functions:** `buildSeq`, `buildPeriodWorkdaySeq`, `buildPeriodWeekendSeq`, `packPeriodBand`, `effectivePeriodLists`, `iterateSuddenTargetingDay`, `displaceSuddenOverlaps`, `suddenTasksNotInSeq`, `applySuddenTasks`, `skipPeriodTask`, `repairSuddenBandLinks`, `bandCapacityStatus`, `flashBandCapacityWarning`, `skippedBandConflicts`, `renderPeriodBands`, `wirePeriodTaskDrag`, `checkTaskAlarms`, `planPreviewWakeMin`, `calendarDayTypeForKey`, `autoDayType`.

Full band windows: [DESIGN.md](./DESIGN.md).

---

## Fixes included in baseline code (`884cd10`)

- Weekend 4-band model + weekly Plan templates
- Safe per-array sync merge
- Gym `blockDur`, band duration steppers, drag reorder
- Task alarms; inline workout/extra pickers; duration-only timeline
- Band capacity warnings
- Skip for today (`periodSkips`)
- Sudden tasks in Today's bands; cross-day lookup; overlap displacement on add
- Sudden packing follows band order; fixed-window suddens keep clock time

---

## For Cursor / new chats

> **Return to baseline.** Read `docs/BASELINE.md`. Do not change sync merge, sudden/band packing, or weekend Plan modal behavior unless I ask. Match tag `baseline-2026-06-09`.

```text
When I say "return to baseline" or "restore baseline-2026-06-09", read docs/BASELINE.md and treat it as the contract. Prefer minimal diffs.
```

See [HANDOFF.md](./HANDOFF.md).

---

## Out of scope at this baseline

- Pinned task start times (Step 3)
- Google Calendar / Todoist
- Multi-user `DATA.profile`
- Full replacement of document-level winner-take-all
- Gym spillover across bands when morning is full

---

## Archive: `baseline-2026-06-08`

Prior checkpoint before skip-for-today and sudden ↔ bands. App at `9c3fe45` (+ `3356525` capacity warnings on `main` before `aab8824`).

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
