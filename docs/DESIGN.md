# Design: Life Command Center

This document captures the real-world constraints that shaped the dashboard. It is the distilled “why” behind `life-dashboard.html`.

**Weekday scheduling source of truth:** [`lifechart2.drawio`](../lifechart2.drawio) (see also `lifechart2.drawio.png`). The older `Lifecommand flowchart.drawio` priority model is retired for workdays.

## Context

- **Location:** Tallahassee, FL (America/New_York)
- **Work:** Remote, Bangkok hours **7:00 AM – 3:00 PM** (local **8:00 PM – 4:00 AM**)
- **Weekends:** Friday and Saturday (no shift those nights)
- **Goals:**
  - Pass **PMP** by **June 22, 2026** (primary focus until exam day)
  - Land a **new job by August 1, 2026** (primary off-work focus after exam)
  - Daily operations: gym, dogs, chickens, garden, proper meals

## Non-negotiable principles (product context)

1. **Sleep is the constraint.** One protected daytime sleep block (~4:00 AM – ~10:00 AM). Avoid split sleep (sleep → wake for work check → sleep again); wrap work before logoff when possible.
2. **Goals:** PMP exam **June 22, 2026** (through that date inclusive); job target **August 1, 2026** — job countdown always shown; PMP countdown and **PMP Prep** tab only through exam day.
3. **Operations are capped.** Animals, garden, meals, and workouts use fixed blocks — not unlimited time sinks.
4. **Meal prep is batched.** Saturday batch prep feeds weekday “reheat” lunches; workdays show a banner if last Saturday’s prep was skipped.

**Weekday block placement** follows **lifechart2 only** (no rules from `Lifecommand flowchart.drawio`).

## Workday template (Sun–Thu) — lifechart2 model

Day starts at **logged wake time**. Build order:

1. **Fixed** clock and wake-anchored blocks (breakfast from wake; dog & dinner per chart — nothing else auto-scheduled as fixed)
2. **Sudden tasks** (manual overlay — fixed window or flexible slot)
3. **Flexible daily minimums** (equal bag — no ranking): bin-packed into daytime gaps before work — **through June 22, 2026:** PMP study + gym + job; **from June 23, 2026:** gym + job only (>2h job target)
4. **Non-fixed** pick (one of Read / AI / QGIS) if time remains
5. **Open time** — remaining slack before deploy

### Fixed (clock or wake-anchored)

| Block | When | Duration |
|-------|------|----------|
| Breakfast | **1 hour from logged wake** | 60m (today-only override via Edit) |
| Dog walk & feed | 4:45–5:30 PM | 45m |
| Dinner | 6:00–7:30 PM | 90m |
| **Work** | 8:00 PM–3:00 AM | 7h (Bangkok 7a–3p) |
| **Sleep** | ~4:00 AM | Protected block |

### Flexible daily bag (equal requirements)

**Through June 22, 2026 (`activeDayKey() <= 2026-06-22`):** schedule PMP, gym, and job before work when physically possible. **No priority** between the three — the agent tries gap layouts (permutations) until all fit.

| Task | Rule |
|------|------|
| **PMP study** | **≥2h/day** as two **60+60** blocks when possible; one **120m** block if a single gap fits. |
| **Gym** | **≥20 min/day**; if gap **≥1h15** → gym + **30m commute each way**; else home workout. Respects Workout **Gym / Home / Skip**. |
| **Job applications** | **≥30 min/day** in a daytime gap. |

**From June 23, 2026:** PMP is removed from the bag, UI, and weekend legacy templates. Only **gym + job** (equal bin-pack). **Job applications** target **>2h/day** (default **61+61** or one **121m** block; overrides via `blockDur.jobapps`, `jobapps1`, `jobapps2`).

If total free time is enough but no layout fits, the banner warns (e.g. **Couldn't fit: workout**) — gym is not silently dropped when Workout ≠ Skip and some gap has **≥20m**.

### Non-fixed (one per day if time remains)

Pick one: Read, Do AI work, or QGIS — **Extra** control (Auto / manual / Skip). Auto rotates by date.

### PMP habit / study tab (through June 22, 2026 only)

- **PMP Prep** tab, quiz, study log, domain sliders, header PMP countdown, and Quick Glance study logging are hidden after exam day.
- Daily target: mark **PMP study** complete when **≥120 minutes** total for `activeDayKey`.
- Count **combined**: minutes from PMP Prep session log (`DATA.sessions`) **plus** completed scheduled study block durations (`study1` / `study2` when checked).
- Historical `DATA.sessions`, `pmpNotes`, and `pmpQuiz` are retained in storage but not shown in the UI after exam day.

**Late wake:** Fixed clock blocks never move. Overlapping blocks show an OVERLAP tag; banner explains what could not fit.

**Buffer line:** Minutes free before 8:00 PM work start, or over-packed warning.

## Friday & Saturday (weekend days)

- No work shift — sleep when ready
- **Night before:** use “Plan day” to list activities (gym, PMP, meal prep, hobby, dinner ~7, read, etc.)
- Agent packs your list from wake time with **open time** gaps between items (for sudden tasks)
- Legacy templates still apply if you have not saved a plan yet
- Saturday batch meal prep still feeds the workday meal-prep banner when logged

## Flexible controls

| Control | Behavior |
|---------|----------|
| Wake time / “Just woke up” | Recomputes all block start times downstream |
| Day type (Auto / Workday / Friday / Saturday) | Auto uses weekday; override for swapped days |
| Workout: Gym / Home / Skip | Default **Gym** (auto): commute session if ≥1h15 free, else home ≥20m. **Skip** only when you tap it. |
| Sudden tasks | Anytime or fixed window; today vs future rules; displaces into open time |
| Weekend plan | Night before: build Friday/Saturday activity list; schedule packs from wake |
| Edit block lengths | Today only (saved in `dayConfig[date].blockDur`) |
| To-do list | Rolls over until done; optional due dates; most urgent surfaces in Quick Glance |

## Dog & dinner windows (workday — lifechart2)

- Dog walk & feed: **4:45–5:30 PM**
- Dinner: **6:00–7:30 PM**

Garden and dinner prep are **not** on lifechart2; they remain as **Daily Non-Negotiables** habits only (manual checkoff), not scheduled fixed blocks.

## What the dashboard does *not* do (yet)

- Sync across phone and laptop (localStorage only on one browser)
- Google Calendar / Todoist integration
- Cloud backup

See [BUILD-HISTORY.md](BUILD-HISTORY.md) for feature evolution and possible future ideas.
