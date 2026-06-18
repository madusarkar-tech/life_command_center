# Build history

Summary of the Claude conversation (May 27–28, 2026) that produced this dashboard. Full chat transcript was provided by the user when the repo was set up.

## Problem statement

Organize life around competing priorities:

- Full-time remote job (Bangkok 7 AM–3 PM from Tallahassee)
- PMP exam **June 22, 2026**
- New job needed by **August 2026**
- Daily: gym (~2h round trip), dogs, chickens, garden, meals, sleep

## Conversation arc

### 1. PM framing and first schedule

Claude treated the situation as portfolio management: fixed resources (time, energy, sleep), hard deadlines, ongoing operations.

Initial assumption was a full night shift (10 PM–7 AM local). User corrected: **work is 7 AM–3 PM Bangkok** → **8 PM–4 AM Tallahassee**, which is much more livable.

### 2. Refined daily template

Key schedule elements agreed:

- Sleep block after work (~4 AM–10 AM)
- Gym mid-afternoon (cortisol clears before sleep)
- PMP in sharp afternoon window until exam
- Garden/animals in golden hour
- Dog walks and dinner at fixed times (4:30–5:15, 6–7 dinner, 7 PM walk #2)
- Optional **20–30 min pre-shift nap** (coffee nap optional)
- Push back on **split sleep** (sleep → 4 AM check → sleep again)

### 3. “Build a live dashboard”

User asked for a browser-based **Command Center** instead of Notion/Sheets. First version included:

- Dual clocks (Tallahassee + Bangkok)
- PMP and job countdowns with progress bars
- Today schedule with NOW highlight
- Habit streaks
- PMP study log + weighted domain sliders
- Job pipeline kanban

### 4. Smart scheduling engine

User requests implemented:

- **Sudden tasks** (+ Task row) that push later blocks
- **Auto-rearranging times** from wake time; work pinned at 8 PM
- **Workout modes:** Gym (2h), Home (45m), Skip
- ~~Wednesday workout off by default~~ — removed; weekdays use lifechart2 only
- **Buffer / overflow** status before shift

### 5. Real week + wake-driven days

- Weekends = **Friday + Saturday** (not Sat/Sun)
- **Friday:** study-heavy, workout after breakfast
- **Saturday:** batch meal prep, chores
- Schedule anchored to **actual wake time** (“Just woke up” button)
- Three day-types: Workday / Friday / Saturday *(removed on `main` at `0fb0441` — calendar shift inference only)*

### 6. Permanent templates + meal prep

- **Edit block lengths** → saved per day type (`templateDur`)
- Friday early-workout locked as default
- **Meal-prep banner** on workdays based on Saturday checkbox

### 7. Rollover to-do + due dates

- To-do list at bottom of Today tab; unchecked items carry forward
- “↻ Nd carried” badge for aging items
- Optional due date with overdue / soon / future styling
- Sort: soonest due first

### 8. Interrupted feature (completed in repo)

Last Claude turn ran out of credits before shipping **“most urgent due item in Quick Glance.”** That was finished when this repository was initialized: `mostUrgentTodo()` + `#urgentNote` in the now banner (Quick Glance was later removed at `94a8aba`; urgent todo moved to **Right now** banner).

### 9. Persistence fix (repo init)

Original artifact used `window.storage` when available; otherwise in-memory only. Repo version adds **localStorage** fallback so data survives refresh when opened locally.

## Recent updates (June 2026)

After the initial repo import, development continued in Cursor:

| Date / commit | Feature |
|---------------|---------|
| `fe372d0` | Safe per-array sync merge for todos, jobTodos, habits, jobs |
| `9aa5ed8` | Gym `blockDur` fix; drag reorder in Today's bands + Plan modal |
| `cc80484` | Block duration editing moved to −/+ steppers on band rows |
| `9c3fe45` | Task alarms (start + optional 5m end warn); Gym/Home/Skip and Extra pickers on band rows; duration-only timeline labels |
| `3356525` | Band capacity warnings — toast on overfull add/move, conflict banner, **· not on timeline** row tags |
| `aab8824` | Skip for today — `periodSkips`; ✕ on band rows + timeline |
| `2889e92` | Sudden ↔ bands sync; cross-day lookup; auto-displace on add |
| `884cd10` | Sudden packing follows band order; fixed-window suddens keep clock time |
| `8d9882f` | Pinned band start times (`periodPinnedStart`); overflow packs user extras |
| `f4e3c79` | Per-field LWW for scratch, PMP, and job notes |
| `473bc2b` | **Week** tab — calendar grid backed by sudden tasks |
| `181363c` | Per-field `dayConfig` merge; merge-before-push on cloud write |
| `f3a7f74` | Gym `blockDur` sync timestamp; todo list-level LWW (deletes stick) |
| `540a3a5` | Merge tie-breaks favor cloud field stamps on reload; `writeLocalAfterSync`; `suppressUiSave` |
| `3d15a16` | Job pipeline list-level LWW (`jobsUpdatedAt`); application deletes stick after sync |
| `0fb0441` | Unified 4-band schedule; calendar shift nights (Sun–Thu work / Fri–Sat off); removed day picker and Weekend Plan modal |
| `94a8aba` | **Quick Glance removed** — Weekly habits card, Workout log (yoga/cardio/lift + lift panel), split Work/Other to-dos; `habitDaily` + `gymLog` sync merge |
| `0dfc253` | Weekly habits UX — tap-to-log grid, partial progress labels, bordered Log panel, live sleep input, `workoutOff` for manual workout |
| `70569b0` | Workout log per-day LWW by `updatedAt` — fixes duplicate sets and resurrected deletes when signed in |
| `dd69a2c` | Workout log sync stability — in-memory merge priority, skip re-render while lift focused, immediate local write |
| `b899d59` | Collapsible lift log disclosure — `gymLiftOpen` persisted |
| `7dfffe9` | **Tab manager** — hide Week/PMP/Jobs; custom notes-only tabs; `DATA.tabUi` + `mergeTabUi` |
| `3304854` | Tab manager startup fix — `applyTabUi()` only after `DATA` loads |
| `1a4272a` | Job to-do list-level LWW (`jobTodosUpdatedAt`) — deletes stick after sync |
| `b0c70fc` | Pin fix — `toMin()` on `periodPinnedStart` in `packPeriodBand` (fixes `12am` / `NaNm` timeline) |
| `c2e2815` | Pin hardening — `pinToMin()`, `safeTaskDur()`, `normalizePeriodPins()` on load |
| `1c9934e` | **Open-time slots in bands** — `periodOpenSlots`; rename/split/move; auto-shrink; activity vs open kinds |
| `0f04f43` | Open-slot band UI — compact single-row layout (name + times + duration) |
| `8e320cb` | Open-slot dismiss — `periodOpenSlotHidden` prevents sync from recreating dismissed gaps |
| `cab37ed` | Cross-band open-slot move — shift clock times into target band window; clear gym pin outside band |

Baseline tag: `baseline-2026-06-10` at app `540a3a5`. Prior: `baseline-2026-06-09` at `884cd10`. See [BASELINE.md](BASELINE.md) and [HANDOFF.md](HANDOFF.md).

## Files in this repo

| File | Role |
|------|------|
| `life-dashboard.html` | Entire application |
| `docs/DESIGN.md` | Constraints and schedule rules |
| `docs/BASELINE.md` | Baseline contract for sync and scheduling |
| `docs/HANDOFF.md` | Short onboarding for new chats |
| `docs/BUILD-HISTORY.md` | This file |
| `docs/workout log.drawio` | Workout log UI mockup (yoga/cardio/lift grid) |
| `README.md` | How to run and what’s included |

## Possible future enhancements (from chat, not built)

- Recurring calendar events
- Gym spillover across bands when morning is full
- Sync via Notion or Google Sheets
- Sunday weekly review reminder

*(Water/hydration tracker and weekly habit % were added at `94a8aba` / `0dfc253`.)*

## Credits

Built interactively with Claude (Anthropic), May 2026. Maintained locally in this repository.
