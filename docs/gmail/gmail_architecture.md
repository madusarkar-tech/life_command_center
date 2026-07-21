# Gmail Labeling Architecture

**Config file:** [`gmail_architecture.json`](gmail_architecture.json)  
**Audit reference:** [`../gmail-sender-map.json`](../gmail-sender-map.json) (auto-generated, read-only stats)

## Purpose

`gmail_architecture.json` is the single file you edit to fine-tune labeling. The agent reads it on every `./gmail audit`, `./gmail cleanup`, and `./gmail daily` run.

## Data layers (first match wins)

| Priority | Layer | Where to edit |
|----------|-------|---------------|
| 1 | Ignore senders | `overrides.ignore_senders` |
| 2 | Exact sender | `overrides.senders` |
| 3 | Sender pattern (`*` wildcard) | `overrides.sender_patterns` |
| 4 | Domain | `overrides.domains` |
| 5 | Subject pattern | `overrides.subject_patterns` |
| 6 | People heuristic | `heuristics.people` |
| 7 | Action keywords | `keywords.action` |
| 8 | AI keywords | `keywords.ai` |
| 9 | Transaction keywords | `keywords.transaction` / `keywords.finance` |
| 10 | Career keywords | `keywords.career` |
| 11 | Newsletter bulk headers | automatic (`List-Unsubscribe`) |
| 12 | Notification domains | `keywords.notification_domains` |
| 13 | Promo keywords | `keywords.promo` |
| 14 | Ambiguous | left in Inbox → `review_queue.pending` |

## Label inbox behavior

Set `"inbox": true` to keep mail in Inbox until read (balanced mode):

- `Priority/People`
- `Priority/Action Required`
- `Read/AI and Tech`

All other labels → labeled + archived.

## Fine-tuning workflow

1. Check audit stats in `gmail-sender-map.json` (`top_senders`, `ambiguous_samples`)
2. Edit `gmail_architecture.json`:
   - Add sender to `overrides.senders`
   - Or add domain to `overrides.domains`
   - Or tune `keywords.*` lists
3. Validate: `./gmail validate-config`
4. Preview: `./gmail cleanup --dry-run`
5. Apply: `./gmail cleanup` (only unprocessed mail is touched)

## Example edits

**Move Skool to AI (already set):**
```json
"senders": {
  "noreply@skool.com": "Read/AI and Tech"
}
```

**Split LinkedIn — jobs vs notifications:**
```json
"senders": {
  "jobalerts-noreply@linkedin.com": "Work/Career",
  "notifications-noreply@linkedin.com": "System/Notifications"
}
```

**Ignore emails to yourself:**
```json
"ignore_senders": ["madusarkar@gmail.com"]
```

## Review queue

Use `review_queue.pending` as a staging area. When you decide, move the entry to `overrides.senders` and remove from pending.

## Related files

| File | Role |
|------|------|
| `gmail_architecture.json` | **Edit this** — rules and overrides |
| `gmail-sender-map.json` | Audit output — stats from last `./gmail audit` |
| `gmail-daily-brief.md` | Morning summary from `./gmail daily` |
| `GMAIL-RULES.md` | Human-readable rule reference |
