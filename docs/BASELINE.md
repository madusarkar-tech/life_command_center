# Baseline checkpoint

**Established:** 2026-06-05 (current) · **Archive:** 2026-06-04  
**Return phrase:** `Return to baseline` or `Restore baseline-2026-06-05`

Use this when you want future work (or a new chat) to treat the app as **known-good** and avoid accidental changes to sync or weekend Plan behavior unless you explicitly ask otherwise.

## Git reference (current)

| Item | Value |
|------|--------|
| Tag | `baseline-2026-06-05` |
| App code commit | `2f5d6b3` — personal Command Center before multi-user profile work |
| Docs commit | Tag points at the commit that updated this file (`life-dashboard.html` same as `2f5d6b3`) |

### Restore code to this baseline

```bash
cd ~/Desktop/Scheduler
git fetch --tags   # if using a remote
git checkout baseline-2026-06-05
```

Restore only the app file (stay on your current branch):

```bash
git checkout baseline-2026-06-05 -- life-dashboard.html
```

List what the tag contains:

```bash
git show baseline-2026-06-05 --stat
```

**Live site:** GitHub Pages follows `main`. Checking out a tag locally does not change Pages until you merge or push that state to `main`.

---

## Changes since `baseline-2026-06-04` (`c525908` app / `3791fa4` docs)

| Commit | Summary |
|--------|---------|
| `e222fd8` | **Auto day type** — `autoDayType()` uses `activeDayKey()` calendar (not wall clock). Fixes missing Work/Sleep between midnight and 4am rollover. |
| `2f5d6b3` | **UI** — removed Daily Non-Negotiables tab; habits only on Today → Quick Glance chips. `renderHabits()` guarded when `#habits` absent. |
| `e3dfb74` | Docs only — scheduling flowcharts (not part of app baseline) |

**Unchanged since 2026-06-04:** sync merge model, weekend Plan modal, period-band scheduling engine, `planPreviewWakeMin(forDayType)` fix.

---

## What “good” means at this baseline

### Product surfaces

- **Today** — period-band schedule, Today's Flow timeline, today-only band overrides, sudden tasks, sidebar to-dos + scratchpad
- **Quick Glance** — block checks, **habit chips** (no separate habits tab), study log shortcuts
- **PMP Prep** — study log, domains, quiz (hidden after exam day)
- **Job Search** — application pipeline, job to-dos, notes
- **Weekend Plan modal** — weekly Fri/Sat templates (`DATA.weekendPeriodTemplate`); in-memory drafts until **Save plan**
- **Sync** — Google Auth + Firestore `users/{uid}`; local `localStorage` when signed out
- **Scheduling spec** — [DESIGN.md](./DESIGN.md) (period-band v1)

**Tabs:** Today · PMP Prep · Job Search (no Daily Non-Negotiables tab).

### Mental model (do not conflate)

| Concept | Storage | Notes |
|---------|---------|--------|
| **Plan** | `weekendPeriodTemplate` + modal drafts | Weekly Fri/Sat defaults; flushed on Save only |
| **Today's bands** | `dayConfig[date]` | Today-only reorder/move/extras |
| **Today's Flow** | Computed | `buildSeq()` → `renderSched()` — not a stored list |
| **To-Do** | `DATA.todos` | Sidebar; separate from schedule blocks |
| **Habits** | `DATA.habits` + Today chips | No dedicated tab; streak UI removed from main nav |

### Day rollover & Auto day type

- Calendar “today” rolls at **4:00 AM** local (`activeDayKey()`, `DAY_ROLLOVER_HOUR = 4`).
- **Auto** day type uses **active day key’s** weekday (`calendarDayTypeForKey(activeDayKey())`), not wall-clock `getDay()` — so shift nights before 4am stay **workday** until rollover.

---

## Sync behavior snapshot (source of truth for agents)

Implementation: `life-dashboard.html` — `Store`, `mergeAppData`, `mergeDayConfig`, `mergeDayEntry`, `mergeDayFields`.

### Layers

| Layer | Keys / path |
|-------|-------------|
| Local | `localStorage` `lifehub:data`, `lifehub:meta` (`updatedAt`) |
| Cloud | Firestore `users/{uid}` document `{ data, updatedAt }` |

### Load path (`Store.load`)

1. Read local snapshot.
2. If signed in, fetch cloud doc.
3. If no local → write cloud to local and use cloud.
4. If both exist → `mergeAppData(local, cloud, localUpdatedAt, cloudUpdatedAt)` → write merged result to local.

### Save path (`Store.save`)

1. Always `writeLocal(d)`.
2. Signed out → flash “Saved”, no cloud write.
3. Signed in → `setSyncDot('pending')`; **urgent** saves call `pushCloud` immediately with `suppressCloudApply` ~1.5s; normal saves **debounce** `pushCloud` ~600–800ms.

### Realtime listener (`Store.startCloudListener`)

- `onSnapshot` on `users/{uid}`.
- Skips: missing data, `hasPendingWrites`, `suppressCloudApply` window, weekend Plan modal open (see below).
- Applies via `Store.applyRemoteData` → may flash “Updated from sync”.

### Top-level merge (`mergeAppData`)

**Winner-take-all by document timestamp** (`localUpdatedAt` vs cloud `updatedAt`):

- The newer snapshot becomes the base (`JSON.parse` copy).
- **Exception:** `dayConfig` is always merged per date (see below).
- **Patch:** if winner lacks `scheduleChecks` but loser has it, copy `scheduleChecks` from loser.

**Fields on the winning snapshot include (non-exhaustive):**  
`todos`, `jobTodos`, `habits`, `sessions`, `jobs`, `domains`, `weekendPeriodTemplate`, `periodTemplate`, notes fields, `mealPrep`, etc.

**Known gap (do not “fix” silently without user approval):**  
If cloud is newer but has **empty** `todos` (or other top-level arrays), local list can be wiped. Safer array-level merge is **out of scope** for this baseline.

### Per-day merge (`mergeDayConfig` / `mergeDayEntry`)

For each `YYYY-MM-DD` key in local and cloud `dayConfig`:

1. Compare `loc._syncAt` vs `clo._syncAt` on that day entry.
2. Newer entry wins as base; older is “other”.
3. Tie on `_syncAt` → use document-level times (`cloudTime >= localTime` → cloud wins).
4. `mergeDayFields(older, newer)`:
   - Start from **newer** copy.
   - Union **suddenTasks** by `id` from older into newer (no duplicates).
   - `_syncAt = max(older, newer)`.

Day edits that should bump sync: call `touchDaySync(dayKey)` → sets `dayConfig[day]._syncAt = Date.now()`.

### Weekend Plan modal guard

- `isWeekendPlanModalOpen()` → `#weekendModal` has class `open`.
- While open: `Store.applyRemoteData` returns **false** (no merge from cloud into UI).
- Drafts live in `weekendTemplateDrafts` `{ friday, saturday }`; **Save plan** → `flushWeekendTemplateDraftsToData()` then persist.
- Do not apply remote data over open modal edits.

### Push suppression

- `suppressCloudApply = Date.now() + 1500` around `pushCloud` and urgent saves to avoid echo from own writes.

### First sign-in

- `Store.seedCloudFromLocal(uid)` uploads local only if cloud doc has no `data`.

### Auth / dev

- Google sign-in requires **http://localhost** (or hosted HTTPS), not `file://`.
- Config: `firebase-config.js` (see `firebase-config.example.js`, [FIREBASE-SETUP.md](./FIREBASE-SETUP.md)).

### Data not in Git

Firestore and `localStorage` are **not** reverted by `git checkout`. Baseline is **code + rules**; user data stays in Firebase unless you export/restore manually.

---

## Scheduling engine (freeze reference)

- **Workday (Sun–Thu):** 3 bands + fixed Work (8pm–3am) + Sleep (3am→wake).
- **Friday / Saturday:** 4 bands through night (8pm–midnight); no work block.
- **Pre-exam (through 2026-06-22):** PMP in defaults; **post-exam:** PMP removed, job apps >2h focus.
- **Key functions:** `buildSeq`, `buildPeriodWorkdaySeq`, `buildPeriodWeekendSeq`, `renderSched`, `renderPeriodBands`, `planPreviewWakeMin(forDayType)`, `calendarDayTypeForKey`, `autoDayType`.

Full band windows and defaults: [DESIGN.md](./DESIGN.md).

---

## Fixes included in baseline code (`2f5d6b3`)

- Weekend 4-band model + weekly Plan templates
- Fri/Sat tab drafts without reload
- Plan: remove preset chips, ✕ on rows, minutes + band capacity
- `planPreviewWakeMin(forDayType)` — no shadowing of `dayType()`
- Auto day type aligned with `activeDayKey` before 4am rollover
- Habits on Today Quick Glance only (tab removed)

---

## For Cursor / new chats

Paste or point the agent at this file and say:

> **Return to baseline.** Read `docs/BASELINE.md`. Do not change sync merge or weekend Plan modal behavior unless I ask. Match tag `baseline-2026-06-05`.

Optional project rule (`.cursor/rules` or User Rules):

```text
When I say "return to baseline" or "restore baseline-2026-06-05", read docs/BASELINE.md and treat it as the contract for sync and scheduling behavior. Prefer minimal diffs; do not redesign mergeAppData or weekend Plan without explicit request.
```

---

## Out of scope at this baseline

- Safer per-array sync merge
- Drag-and-drop reorder (buttons only)
- Google Calendar / Todoist
- Multi-user onboarding / `DATA.profile` (planned next — use legacy migration when building)

---

## Archive: `baseline-2026-06-04`

Earlier checkpoint before day-type fix and habits tab removal. App at `c525908`; docs at `3791fa4`.

```bash
git checkout baseline-2026-06-04 -- life-dashboard.html
```

---

## Creating a *new* baseline later

1. Commit when code + sync behavior are right again.
2. `git tag -a baseline-YYYY-MM-DD -m "description"`
3. Update this file with new tag, commit hash, and changelog since prior baseline.
