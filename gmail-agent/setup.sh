#!/usr/bin/env bash
# One-time Gmail OAuth setup helper
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
CREDS="$HOME/.gmail-mcp/credentials.json"

mkdir -p "$HOME/.gmail-mcp"
mkdir -p "$DIR/logs"

echo "=== Gmail Daily Cleanup Agent — Setup ==="
echo ""

if [[ -f "$CREDS" ]]; then
  echo "✓ credentials.json found at $CREDS"
else
  echo "Step 1: Create Google Cloud OAuth credentials"
  echo ""
  echo "  1. Open Google Cloud Console (opening in browser...)"
  open "https://console.cloud.google.com/apis/library/gmail.googleapis.com"
  sleep 2
  open "https://console.cloud.google.com/apis/credentials"
  echo ""
  echo "  2. Enable Gmail API for your project"
  echo "  3. Configure OAuth consent screen (External, add gmail.modify scope)"
  echo "  4. Create OAuth client ID → Desktop app"
  echo "  5. Download JSON and save as:"
  echo "     $CREDS"
  echo ""
  read -rp "Press Enter after you've saved credentials.json... "
fi

if [[ ! -f "$CREDS" ]]; then
  echo "ERROR: credentials.json still missing at $CREDS"
  exit 1
fi

echo ""
echo "Step 2: Authenticate with Google..."
"$DIR/gmail" auth

echo ""
echo "Step 3: Verify connection..."
"$DIR/gmail" status

echo ""
echo "Step 4: Audit inbox..."
"$DIR/gmail" audit

echo ""
echo "Step 5: Review docs/gmail-sender-map.json then approve:"
echo "  ./gmail approve"
echo ""
echo "Step 6: Create labels and run cleanup:"
echo "  ./gmail labels"
echo "  ./gmail cleanup --dry-run"
echo "  ./gmail cleanup"
echo ""
echo "Step 7: Enable daily schedule (7am):"
echo "  cp com.madusarkar.gmail-daily.plist ~/Library/LaunchAgents/"
echo "  launchctl load ~/Library/LaunchAgents/com.madusarkar.gmail-daily.plist"
echo ""
echo "Setup helper complete."
