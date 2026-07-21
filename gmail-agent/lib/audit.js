import {
  AUDIT_DAYS, SENDER_MAP_FILE, writeJson,
} from "./config.js";
import { classifyMessage } from "./classify.js";
import { profileEmail } from "./auth.js";

async function fetchMessages(gmail, query, maxResults = 500) {
  const messages = [];
  let pageToken;
  while (messages.length < maxResults) {
    const res = await gmail.users.messages.list({
      userId: "me",
      q: query,
      maxResults: Math.min(100, maxResults - messages.length),
      pageToken,
    });
    for (const item of res.data.messages || []) {
      const msg = await gmail.users.messages.get({
        userId: "me",
        id: item.id,
        format: "metadata",
        metadataHeaders: ["From", "Subject", "List-Unsubscribe", "Precedence"],
      });
      messages.push(msg.data);
    }
    pageToken = res.data.nextPageToken;
    if (!pageToken) break;
  }
  return messages;
}

function parseFrom(fromRaw) {
  const match = fromRaw.match(/<([^>]+)>/);
  const email = (match ? match[1] : fromRaw).trim().toLowerCase();
  const domain = email.includes("@") ? email.split("@")[1] : "";
  return { email, domain };
}

function header(headers, name) {
  const h = headers?.find((x) => x.name?.toLowerCase() === name.toLowerCase());
  return h?.value || "";
}

export async function runAudit(gmail) {
  const email = await profileEmail(gmail);
  const query = `newer_than:${AUDIT_DAYS}d`;
  console.log(`Auditing mail for ${email} (${query})...`);
  const messages = await fetchMessages(gmail, query);
  console.log(`  Fetched ${messages.length} messages`);

  const senderCounts = {};
  const domainCounts = {};
  const labelCounts = {};
  const domainLabels = {};
  const ambiguous = [];
  const samples = {};

  for (const msg of messages) {
    const headers = msg.payload?.headers || [];
    const fromRaw = header(headers, "From");
    const subject = header(headers, "Subject");
    const { email: fromEmail, domain } = parseFrom(fromRaw);

    senderCounts[fromEmail] = (senderCounts[fromEmail] || 0) + 1;
    domainCounts[domain] = (domainCounts[domain] || 0) + 1;

    const [label] = classifyMessage(msg);
    if (label) {
      labelCounts[label] = (labelCounts[label] || 0) + 1;
      if (!domainLabels[domain]) domainLabels[domain] = {};
      domainLabels[domain][label] = (domainLabels[domain][label] || 0) + 1;
      if (!samples[label]) samples[label] = [];
      if (samples[label].length < 5) {
        samples[label].push({ from: fromRaw, subject: subject.slice(0, 80) });
      }
    } else {
      ambiguous.push({ from: fromRaw, subject, reason: "ambiguous" });
    }
  }

  const proposedDomains = {};
  for (const [domain, counts] of Object.entries(domainLabels)) {
    if (!domain) continue;
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    if (total >= 2) {
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      const [bestLabel, bestCount] = sorted[0];
      if (bestCount / total >= 0.6) proposedDomains[domain] = bestLabel;
    }
  }

  const unread = await gmail.users.messages.list({ userId: "me", q: "is:unread", maxResults: 1 });
  const inbox = await gmail.users.messages.list({ userId: "me", q: "in:inbox", maxResults: 1 });

  const topSenders = Object.entries(senderCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)
    .map(([e, c]) => ({ email: e, count: c, domain: e.split("@")[1] || "" }));

  const result = {
    generated_at: new Date().toISOString(),
    account: email,
    period_days: AUDIT_DAYS,
    messages_analyzed: messages.length,
    unread_estimate: unread.data.resultSizeEstimate || 0,
    inbox_estimate: inbox.data.resultSizeEstimate || 0,
    label_distribution: labelCounts,
    top_senders: topSenders,
    ambiguous_count: ambiguous.length,
    ambiguous_samples: ambiguous.slice(0, 30),
    label_samples: samples,
    domains: proposedDomains,
    senders: {},
    status: "proposed",
    notes: "Review and set status to 'approved' before running cleanup.",
  };

  writeJson(SENDER_MAP_FILE, result);
  console.log(`\nAudit complete → ${SENDER_MAP_FILE}`);
  console.log(`  Messages: ${messages.length} | Unread: ${result.unread_estimate} | Inbox: ${result.inbox_estimate}`);
  console.log(`  Ambiguous: ${ambiguous.length} | Domain rules: ${Object.keys(proposedDomains).length}`);
  for (const [label, count] of Object.entries(labelCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`    ${label}: ${count}`);
  }
  return result;
}
