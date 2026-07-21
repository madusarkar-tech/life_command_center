import {
  AUDIT_DAYS, BATCH_SIZE, SENDER_MAP_FILE, readJson,
} from "./config.js";
import { classifyMessage, getInboxLabels } from "./classify.js";
import { ensureLabels, listLabels } from "./labels.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function withRetry(fn, retries = 6) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const retryable = [429, 403, 500, 503].includes(err.code) ||
        /rate|quota|Precondition|backend/i.test(err.message || "");
      if (!retryable || attempt === retries - 1) throw err;
      const wait = Math.min(30000, 1000 * 2 ** attempt);
      console.log(`  Rate limited — waiting ${wait / 1000}s before retry...`);
      await sleep(wait);
    }
  }
}

async function fetchMessageIds(gmail, query, maxResults = 2000) {
  const ids = [];
  let pageToken;
  while (ids.length < maxResults) {
    const res = await gmail.users.messages.list({
      userId: "me",
      q: query,
      maxResults: Math.min(100, maxResults - ids.length),
      pageToken,
    });
    for (const m of res.data.messages || []) ids.push(m.id);
    pageToken = res.data.nextPageToken;
    if (!pageToken) break;
  }
  return ids;
}

async function applyLabels(gmail, msgId, addLabels, removeLabels) {
  const add = addLabels.filter(Boolean);
  const remove = removeLabels.filter(Boolean);
  if (!add.length && !remove.length) return;
  try {
    await withRetry(() => gmail.users.messages.modify({
      userId: "me",
      id: msgId,
      requestBody: { addLabelIds: add, removeLabelIds: remove },
    }));
  } catch (err) {
    if (/labelId not found/i.test(err.message || "")) {
      // Retry without remove labels (message may already be archived)
      if (remove.length && add.length) {
        await withRetry(() => gmail.users.messages.modify({
          userId: "me",
          id: msgId,
          requestBody: { addLabelIds: add, removeLabelIds: [] },
        }));
        return;
      }
    }
    throw err;
  }
}

export async function runCleanup(gmail, { dryRun = false } = {}) {
  let senderMapData;
  try {
    senderMapData = readJson(SENDER_MAP_FILE);
  } catch {
    throw new Error(`Sender map not found: ${SENDER_MAP_FILE}. Run audit first.`);
  }

  if (senderMapData.status !== "approved") {
    console.log("WARNING: Sender map not approved. Proceeding with proposed rules.");
  }

  const labelIds = await ensureLabels(gmail);
  const allLabels = await listLabels(gmail);
  const inboxId = allLabels.INBOX;
  const processedId = labelIds["System/Processed"];
  const INBOX_LABELS = getInboxLabels();

  const query = `newer_than:${AUDIT_DAYS}d -label:System/Processed`;
  const msgIds = await fetchMessageIds(gmail, query);
  console.log(`Processing ${msgIds.length} messages (dryRun=${dryRun})...`);

  const stats = {};
  let archived = 0;
  let keptInbox = 0;
  let ambiguous = 0;

  for (let i = 0; i < msgIds.length; i += BATCH_SIZE) {
    const batch = msgIds.slice(i, i + BATCH_SIZE);
    for (const msgId of batch) {
      const msg = await withRetry(() => gmail.users.messages.get({
        userId: "me",
        id: msgId,
        format: "metadata",
        metadataHeaders: ["From", "Subject", "List-Unsubscribe", "Precedence"],
      }));

      const [label] = classifyMessage(msg.data);
      if (!label || !labelIds[label]) {
        ambiguous++;
        stats.ambiguous = (stats.ambiguous || 0) + 1;
        continue;
      }

      stats[label] = (stats[label] || 0) + 1;
      const add = [labelIds[label], processedId];
      const remove = INBOX_LABELS.has(label) ? [] : [inboxId];

      if (INBOX_LABELS.has(label)) keptInbox++;
      else archived++;

      if (dryRun) {
        console.log(`  [${INBOX_LABELS.has(label) ? "keep" : "archive"}] ${label}: ${msgId}`);
      } else {
        await applyLabels(gmail, msgId, add, remove);
        await sleep(250);
      }
    }
    if (!dryRun) {
      console.log(`  Processed ${Math.min(i + BATCH_SIZE, msgIds.length)}/${msgIds.length}`);
      await sleep(500);
    }
  }

  console.log(`\nCleanup: total=${msgIds.length} archived=${archived} inbox=${keptInbox} ambiguous=${ambiguous}`);
  return { total: msgIds.length, stats, archived, keptInbox, ambiguous, dryRun };
}
