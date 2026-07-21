import { loadArchitecture, matchPattern } from "./architecture.js";

function header(headers, name) {
  const h = headers?.find((x) => x.name?.toLowerCase() === name.toLowerCase());
  return h?.value || "";
}

function parseFrom(fromRaw) {
  const match = fromRaw.match(/<([^>]+)>/);
  const email = (match ? match[1] : fromRaw).trim().toLowerCase();
  const domain = email.includes("@") ? email.split("@")[1] : "";
  return { email, domain, fromRaw };
}

function hasBulkHeaders(headers) {
  const listId = header(headers, "List-Unsubscribe");
  const precedence = header(headers, "Precedence").toLowerCase();
  return Boolean(listId) || precedence === "bulk" || precedence === "list";
}

function contains(text, keywords) {
  const lower = text.toLowerCase();
  return keywords.some((k) => lower.includes(k));
}

function isNoreply(email) {
  const local = email.split("@")[0] || email;
  return ["noreply", "no-reply", "donotreply", "do-not-reply", "mailer-daemon"]
    .some((p) => local.includes(p));
}

export function classifyMessage(msg) {
  const arch = loadArchitecture();
  const kw = arch.keywords;
  const headers = msg.payload?.headers || [];
  const fromRaw = header(headers, "From");
  const subject = header(headers, "Subject");
  const { email, domain } = parseFrom(fromRaw);
  const combined = `${fromRaw} ${subject}`;

  // 1. Ignore
  if (arch.ignoreSenders.has(email)) {
    return ["", "ignored"];
  }

  // 2. Exact sender
  if (arch.senders[email]) {
    return [arch.senders[email], "sender-exact"];
  }

  // 3. Sender patterns
  for (const p of arch.senderPatterns) {
    if (matchPattern(email, p.match)) {
      return [p.label, "sender-pattern"];
    }
  }

  // 4. Domain
  if (arch.domains[domain]) {
    return [arch.domains[domain], "domain"];
  }

  // 5. Subject patterns
  for (const p of arch.subjectPatterns) {
    const hay = p.case_insensitive !== false ? combined.toLowerCase() : combined;
    const needle = p.case_insensitive !== false ? p.match.toLowerCase() : p.match;
    if (hay.includes(needle)) {
      return [p.label, "subject-pattern"];
    }
  }

  // 6. People heuristic
  const people = arch.heuristics.people;
  if (people.enabled && email && !isNoreply(email) && !hasBulkHeaders(headers)) {
    const excludeKw = people.exclude_if_keywords_from.includes("promo")
      ? kw.promo
      : [];
    const excludeCareer = people.exclude_if_keywords_from.includes("career")
      ? kw.career
      : [];
    if (people.free_email_domains.includes(domain) || fromRaw.split(" ").length >= 2) {
      if (!contains(combined, [...excludeKw, ...excludeCareer])) {
        return ["Priority/People", "people-heuristic"];
      }
    }
  }

  // 7–13. Keyword waterfall
  if (contains(combined, kw.action)) return ["Priority/Action Required", "action-keywords"];
  if (contains(combined, kw.ai)) return ["Read/AI and Tech", "ai-keywords"];
  if (contains(combined, kw.transaction)) {
    if (contains(combined, kw.finance)) return ["Transactions/Finance", "finance-keywords"];
    return ["Transactions/Purchases", "transaction-keywords"];
  }
  if (contains(combined, kw.career) || domain.includes("linkedin")) {
    return ["Work/Career", "career-keywords"];
  }
  if (contains(combined, kw.finance)) return ["Transactions/Finance", "finance-keywords"];
  if (hasBulkHeaders(headers) && !contains(combined, kw.promo)) {
    return ["Read/Newsletters", "newsletter-bulk"];
  }
  if (kw.notification_domains.some((d) => domain.includes(d))) {
    return ["System/Notifications", "notification-domain"];
  }
  if (contains(combined, kw.promo) || hasBulkHeaders(headers)) {
    return ["System/Promotions", "promo-keywords"];
  }

  return ["", "ambiguous"];
}

/** Inbox labels from architecture (for cleanup/daily). */
export function getInboxLabels() {
  const arch = loadArchitecture();
  return arch.inboxLabels || new Set([
    "Priority/People",
    "Priority/Action Required",
    "Read/AI and Tech",
  ]);
}
