# Gmail Classification Rules

Balanced mode: **People**, **Action Required**, and **AI & Tech** stay in Inbox until read. Everything else is labeled and archived.

## Label structure

### Stays in Inbox

| Label | Purpose |
|-------|---------|
| `Priority/People` | Real human correspondence |
| `Priority/Action Required` | Replies, deadlines, confirmations |
| `Read/AI and Tech` | AI newsletters and tools you want to read |

### Labeled + archived

| Label | Purpose |
|-------|---------|
| `Read/Newsletters` | Other subscriptions worth keeping |
| `Transactions/Purchases` | Orders, shipping, receipts |
| `Transactions/Finance` | Banks, bills, tax |
| `Work/Career` | Jobs, recruiters, applications |
| `System/Notifications` | GitHub, LinkedIn, app alerts |
| `System/Promotions` | Marketing, sales, coupons |
| `System/Processed` | Agent audit trail |

## Fine-tuning

Edit **[docs/gmail/gmail_architecture.json](gmail/gmail_architecture.json)** to override senders, domains, keywords, and inbox behavior. See [gmail_architecture.md](gmail/gmail_architecture.md).

```bash
./gmail validate-config
./gmail cleanup --dry-run
```

## Classification order (first match wins)

Rules are loaded from `gmail_architecture.json`. Default order:

1. **Ignore senders** — `overrides.ignore_senders`
2. **Exact sender / domain / patterns** — `overrides.senders`, `domains`, `sender_patterns`, `subject_patterns`
3. **Priority/People** — people heuristic
4. **Priority/Action Required** — action keywords in subject/from
5. **Read/AI and Tech** — AI keyword match
6. **Transactions/Purchases** or **Transactions/Finance** — order/receipt/bill patterns
7. **Work/Career** — job alert, recruiter, careers@ patterns
8. **Read/Newsletters** — List-Unsubscribe header, not promotional
9. **System/Notifications** — known notification domains
10. **System/Promotions** — marketing keywords or bulk mail
11. **Ambiguous** — left in Inbox, listed in daily brief

## Keyword lists

### AI & Tech

ai, openai, anthropic, claude, cursor, hugging face, gemini, copilot, llm, machine learning, arxiv, substack, mistral, perplexity, langchain, nvidia ai, google ai, meta ai

### Action Required

action required, confirm your, verify your, deadline, rsvp, signature needed, please respond, expires, invitation, security alert

### Career

job alert, application received, interview, recruiter, greenhouse, lever.co, workday, indeed, linkedin jobs, careers@, hiring

## Daily agent behavior

Each morning the agent:

1. Fetches mail from last 24h not yet labeled `System/Processed`
2. Classifies using rules + sender map
3. Applies labels; archives non-inbox labels
4. Writes `docs/gmail-daily-brief.md`

## Your 2-minute daily check

1. Open **Priority/People** in Gmail
2. Open **Priority/Action Required**
3. Open **Read/AI and Tech**
4. Optional: read `docs/gmail-daily-brief.md` on Desktop

## Customizing senders

Edit `docs/gmail-sender-map.json`:

```json
{
  "domains": {
    "newsletter.example.com": "Read/Newsletters",
    "jobs.linkedin.com": "Work/Career"
  },
  "senders": {
    "friend@gmail.com": "Priority/People"
  },
  "status": "approved"
}
```

After edits, run `./gmail cleanup` to re-process unlabeled mail.
