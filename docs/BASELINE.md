# Baseline checkpoint

**Established:** 2026-06-04  
**Return phrase:** `Return to baseline` or `Restore baseline-2026-06-04`

Use this when you want future work (or a new chat) to treat the app as **known-good** and avoid accidental changes to sync or weekend Plan behavior unless you explicitly ask otherwise.

## Git reference

| Item | Value |
|------|--------|
| Tag | `baseline-2026-06-04` |
| App code commit | `c525908` — fix `planPreviewWakeMin` parameter shadowing `dayType()` (Today's Flow + Plan band redraw) |
| Docs commit | Tag points at the commit that added this file (same `life-dashboard.html` as `c525908` unless noted in git log) |

### Restore code to this baseline

```bash
cd ~/Desktop/Scheduler
git fetch --tags   # if using a remote
git checkout baseline-2026-06-04
```

Restore only the app file (stay on your current branch):

```bash
git checkout baseline-2026-06-04 -- life-dashboard.html
```

List what the tag contains:

```bash
git show baseline-2026-06-04 --stat
```

**Live site:** GitHub Pages follows `main`. Checking out a tag locally does not change Pages until you merge or push that state to `main`.

---

## What “good” means at this baseline

### Product surfaces (unchanged intent)

- **Today** — period-band schedule, Today's Flow timeline, today-only band overrides, sudden tasks, sidebar to-dos
- **Weekend Plan modal** — weekly Fri/Sat templates (`DATA.weekendPeriodTemplate`); in-memory drafts until **Save plan**
- **Sync** — Google Auth + Firestore `users/{uid}`; local `localStorage` when signed out
- **Scheduling spec** — [DESIGN.md](./DESIGN.md) (period-band v1)

### Mental model (do not conflate)

| Concept | Storage | Notes |
|---------|---------|--------|
| **Plan** | `weekendPeriodTemplate` + modal drafts | Weekly Fri/Sat defaults; flushed on Save only |
| **Today's bands** | `dayConfig[date]` | Today-only reorder/move/extras |
| **Today's Flow** | Computed | `buildSeq()` → `renderSched()` — not a stored list |
| **To-Do** | `DATA.todos` | Sidebar; separate from schedule blocks |

### Day rollover

- Calendar “today” rolls at **4:00 AM** local (`activeDayKey()`, `DAY_ROLLOVER_HOUR = 4`).

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
- **Key functions:** `buildSeq`, `buildPeriodWorkdaySeq`, `buildPeriodWeekendSeq`, `renderSched`, `renderPeriodBands`, `planPreviewWakeMin(forDayType)`.

Full band windows and defaults: [DESIGN.md](./DESIGN.md).

---

## Recent fixes included in baseline code

- Weekend 4-band model + weekly Plan templates
- Fri/Sat tab drafts without reload
- Plan: remove preset chips, ✕ on rows, minutes + band capacity
- `planPreviewWakeMin(forDayType)` — no shadowing of `dayType()`

---

## For Cursor / new chats

Paste or point the agent at this file and say:

> **Return to baseline.** Read `docs/BASELINE.md`. Do not change sync merge or weekend Plan modal behavior unless I ask. Match tag `baseline-2026-06-04`.

Optional project rule (`.cursor/rules` or User Rules):

```text
When I say "return to baseline" or "restore baseline-2026-06-04", read docs/BASELINE.md and treat it as the contract for sync and scheduling behavior. Prefer minimal diffs; do not redesign mergeAppData or weekend Plan without explicit request.
```

---

## Out of scope at this baseline

- Safer per-array sync merge
- Drag-and-drop reorder (buttons only)
- Google Calendar / Todoist, multi-user SaaS
- Friends/profile onboarding

---

## Creating a *new* baseline later

1. Commit when code + sync behavior are right again.
2. `git tag -a baseline-YYYY-MM-DD -m "description"`
3. Update this file (or add `BASELINE-YYYY-MM-DD.md`) with new tag, commit hash, and any sync rule changes.
