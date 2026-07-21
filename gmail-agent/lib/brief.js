import fs from "fs";
import path from "path";
import { DAILY_BRIEF_FILE } from "./config.js";
import { classifyMessage, getInboxLabels } from "./classify.js";
import { ensureLabels, listLabels } from "./labels.js";

function header(headers, name) {
  const h = headers?.find((x) => x.name?.toLowerCase() === name.toLowerCase());
  return h?.value || "";
}

function msgSummary(msg) {
  const headers = msg.payload?.headers || [];
  return {
    from: header(headers, "From"),
    subject: header(headers, "Subject"),
    date: header(headers, "Date"),
    id: msg.id,
  };
}

async function applyLabels(gmail, msgId, addLabels, removeLabels) {
  await gmail.users.messages.modify({
    userId: "me",
    id: msgId,
    requestBody: { addLabelIds: addLabels, removeLabelIds: removeLabels },
  });
}

export async function runDaily(gmail) {
  const labelIds = await ensureLabels(gmail);
  const allLabels = await listLabels(gmail);
  const inboxId = allLabels.INBOX;
  const processedId = labelIds["System/Processed"];
  const INBOX_LABELS = getInboxLabels();

  const res = await gmail.users.messages.list({
    userId: "me",
    q: "newer_than:1d -label:System/Processed",
    maxResults: 100,
  });

  const people = [], action = [], ai = [], ambiguous = [], promos = [];

  for (const item of res.data.messages || []) {
    const msg = await gmail.users.messages.get({
      userId: "me",
      id: item.id,
      format: "metadata",
      metadataHeaders: ["From", "Subject", "Date"],
    });

    const [label] = classifyMessage(msg.data);
    const summary = msgSummary(msg.data);

    if (!label) {
      ambiguous.push(summary);
      continue;
    }

    const add = [labelIds[label], processedId];
    const remove = INBOX_LABELS.has(label) ? [] : [inboxId];
    await applyLabels(gmail, item.id, add, remove);

    if (label === "Priority/People") people.push(summary);
    else if (label === "Priority/Action Required") action.push(summary);
    else if (label === "Read/AI and Tech") ai.push(summary);
    else if (label === "System/Promotions") promos.push(summary);
  }

  const now = new Date().toISOString().replace("T", " ").slice(0, 16) + " UTC";
  const lines = [
    "# Gmail Daily Brief",
    "",
    `Generated: ${now}`,
    `Processed: ${(res.data.messages || []).length} messages from last 24h`,
    "",
    `## Priority — People (${people.length})`,
    "",
  ];

  if (people.length) people.forEach((p) => lines.push(`- **${p.subject}** — ${p.from} (${p.date})`));
  else lines.push("_None today._");

  lines.push("", `## Action Required (${action.length})`, "");
  if (action.length) action.forEach((a) => lines.push(`- **${a.subject}** — ${a.from} (${a.date})`));
  else lines.push("_None today._");

  lines.push("", `## AI & Tech to Read (${ai.length})`, "");
  if (ai.length) ai.forEach((a) => lines.push(`- ${a.subject} — ${a.from}`));
  else lines.push("_None today._");

  lines.push("", `## Needs Your Decision (${ambiguous.length})`, "");
  if (ambiguous.length) ambiguous.slice(0, 10).forEach((a) => lines.push(`- ${a.subject} — ${a.from}`));
  else lines.push("_None._");

  lines.push("", `## Archived Promotions (${promos.length})`, "");
  lines.push(`_${promos.length} marketing emails labeled and archived._`);
  lines.push("", "---", "", "**Daily check order:** Priority/People → Priority/Action Required → Read/AI and Tech");

  const brief = lines.join("\n");
  fs.mkdirSync(path.dirname(DAILY_BRIEF_FILE), { recursive: true });
  fs.writeFileSync(DAILY_BRIEF_FILE, brief);
  console.log(`Daily brief → ${DAILY_BRIEF_FILE}`);
  return brief;
}
