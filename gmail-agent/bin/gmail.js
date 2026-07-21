#!/usr/bin/env node
import { credentialsReady, getGmail, profileEmail, tokenReady } from "../lib/auth.js";
import { runAudit } from "../lib/audit.js";
import { runCleanup } from "../lib/cleanup.js";
import { runDaily } from "../lib/brief.js";
import { ensureLabels } from "../lib/labels.js";
import { SENDER_MAP_FILE, readJson, writeJson } from "../lib/config.js";
import { validateArchitecture } from "../lib/architecture.js";

const [,, command, ...rest] = process.argv;

async function main() {
  if (command === "status") {
    console.log(`Credentials: ${credentialsReady() ? "OK" : "MISSING"}`);
    console.log(`Token:       ${tokenReady() ? "OK" : "MISSING"}`);
    if (credentialsReady() && tokenReady()) {
      const gmail = await getGmail();
      console.log(`Account:     ${await profileEmail(gmail)}`);
    }
    return;
  }

  if (command === "validate-config") {
    const { valid, errors } = validateArchitecture();
    if (valid) {
      console.log("gmail_architecture.json is valid.");
    } else {
      errors.forEach((e) => console.error(`  ERROR: ${e}`));
      process.exit(1);
    }
    return;
  }

  if (command === "approve") {
    const data = readJson(SENDER_MAP_FILE);
    data.status = "approved";
    writeJson(SENDER_MAP_FILE, data);
    console.log("Sender map approved.");
    return;
  }

  const gmail = await getGmail();

  switch (command) {
    case "auth":
      console.log(`Authenticated as ${await profileEmail(gmail)}`);
      break;
    case "labels":
      await ensureLabels(gmail);
      break;
    case "audit":
      await runAudit(gmail);
      break;
    case "cleanup": {
      const dryRun = rest.includes("--dry-run");
      if (rest.includes("--approve")) {
        const data = readJson(SENDER_MAP_FILE);
        data.status = "approved";
        writeJson(SENDER_MAP_FILE, data);
      }
      await runCleanup(gmail, { dryRun });
      break;
    }
    case "daily":
      await runDaily(gmail);
      break;
    default:
      console.log(`Gmail Daily Cleanup Agent

Usage: gmail <command>

Commands:
  status    Check OAuth credentials and connection
  auth      Run OAuth flow (opens browser)
  labels    Create all Gmail labels
  audit     Scan inbox and write sender map proposal
  approve   Mark sender map as approved
  validate-config  Validate docs/gmail/gmail_architecture.json
  cleanup   Bulk label and archive (--dry-run, --approve)
  daily     Process last 24h and write morning brief
`);
      process.exit(command ? 1 : 0);
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
