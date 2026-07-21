# Gmail OAuth — Step-by-Step Walkthrough

Complete these steps in your browser (Google Cloud Console). Use **madusarkar@gmail.com**.

## Step 1 — Sign in to Google Cloud

1. In the browser tab that opened, click **madusarkar@gmail.com**
2. Enter your password / complete 2FA if prompted

## Step 2 — Create a project

1. Go to: https://console.cloud.google.com/projectcreate
2. Project name: `Gmail Cleanup Agent`
3. Click **Create**
4. Wait for the project to be created, then select it from the top dropdown

## Step 3 — Enable Gmail API

1. Go to: https://console.cloud.google.com/apis/library/gmail.googleapis.com
2. Make sure your new project is selected (top bar)
3. Click **Enable**

## Step 4 — Configure OAuth consent screen

1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. Click **Get started** (or **Configure consent screen**)
3. Choose **External** → Create
4. Fill in:
   - App name: `Gmail Cleanup Agent`
   - User support email: `madusarkar@gmail.com`
   - Developer contact: `madusarkar@gmail.com`
5. Click **Save and Continue**
6. On **Scopes** page → **Add or remove scopes**
7. Search for `gmail.modify` and check:
   - `https://www.googleapis.com/auth/gmail.modify`
8. Save → Continue through remaining steps
9. On **Test users** → **Add users** → add `madusarkar@gmail.com`
10. Save

## Step 5 — Create OAuth Desktop credentials

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click **+ Create Credentials** → **OAuth client ID**
3. Application type: **Desktop app**
4. Name: `Gmail MCP Desktop`
5. Click **Create**
6. Click **Download JSON** (download icon)

## Step 6 — Save credentials on your Mac

Move the downloaded file to:

```text
~/.gmail-mcp/credentials.json
```

In Terminal:

```bash
mkdir -p ~/.gmail-mcp
mv ~/Downloads/client_secret*.json ~/.gmail-mcp/credentials.json
```

(The filename may vary — rename it to exactly `credentials.json`)

## Step 7 — Authenticate and run the agent

```bash
cd ~/Desktop/05-Shortcuts/life-command-center/gmail-agent
./gmail auth          # Opens browser — click Allow
./gmail status        # Should show OK + your email
./gmail audit         # Scans your inbox
./gmail approve       # After reviewing sender map
./gmail labels        # Creates Gmail labels
./gmail cleanup       # Organizes last 90 days
./gmail daily         # Writes morning brief
```

Or run the all-in-one helper:

```bash
./setup.sh
```

## Step 8 — Restart Cursor (for MCP)

After auth succeeds, restart Cursor so the Gmail MCP server in `~/.cursor/mcp.json` picks up your credentials.

---

**When done with Step 6**, reply in chat: **"credentials ready"** and I'll run the audit and cleanup for you.
