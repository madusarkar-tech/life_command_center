# Gmail Setup

Connect `madusarkar@gmail.com` to the Gmail Daily Cleanup Agent via OAuth and MCP.

**Need step-by-step help?** See [GMAIL-OAUTH-WALKTHROUGH.md](GMAIL-OAUTH-WALKTHROUGH.md) — full click-by-click guide with screenshots-level detail.

## 1. Google Cloud (one-time, ~10 min)

See [GMAIL-OAUTH-WALKTHROUGH.md](GMAIL-OAUTH-WALKTHROUGH.md) for the full guide. Summary:

1. Create a Google Cloud project
2. Enable **Gmail API**
3. Configure OAuth consent screen (External, add `gmail.modify` scope, add test user)
4. Create **Desktop app** OAuth client ID
5. Download JSON and save as:

```text
~/.gmail-mcp/credentials.json
```

## 2. Authenticate

From the life-command-center repo:

```bash
cd gmail-agent
./gmail auth
```

This opens a browser for Google sign-in. Token is saved to `~/.gmail-mcp/token.json`.

Verify:

```bash
./gmail status
# Credentials: OK
# Token:       OK
# Account:     madusarkar@gmail.com
```

## 3. Cursor MCP (optional, for chat-based mail access)

MCP config is at `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "gmail": {
      "command": "npx",
      "args": ["-y", "gmail-mcp-server"]
    }
  }
}
```

Restart Cursor after placing credentials. The MCP server uses the same `~/.gmail-mcp/` credentials.

## 4. First run sequence

```bash
./gmail audit          # Scan inbox → docs/gmail-sender-map.json
# Review sender map, then:
./gmail approve        # Mark map approved
./gmail labels         # Create nested labels in Gmail
./gmail cleanup        # Bulk label + archive (90 days)
./gmail daily          # Process last 24h + write brief
```

Dry-run cleanup first:

```bash
./gmail cleanup --dry-run
```

## 5. Daily schedule (macOS)

A LaunchAgent runs daily at 7:00 AM ET:

```bash
cp gmail-agent/com.madusarkar.gmail-daily.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.madusarkar.gmail-daily.plist
```

Logs: `gmail-agent/logs/daily.log`

## Security

- Never commit `credentials.json`, `token.json`, or OAuth keys
- Tokens live in `~/.gmail-mcp/` only
- Agent archives mail; it does not delete or send mail

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `Missing OAuth credentials` | Place Desktop OAuth JSON at `~/.gmail-mcp/credentials.json` |
| `redirect_uri_mismatch` | Use Desktop app credentials; redirect URI `http://localhost:44000/oauth2callback` |
| MCP not showing in Cursor | Restart Cursor; check Settings → MCP |
| `Access blocked` on OAuth | Add your email as test user in OAuth consent screen |
