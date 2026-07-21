import fs from "fs";
import { ARCHITECTURE_FILE, readJson, LABELS } from "./config.js";
import {
  AI_KEYWORDS, ACTION_KEYWORDS, TRANSACTION_KEYWORDS, FINANCE_KEYWORDS,
  CAREER_KEYWORDS, PROMO_KEYWORDS, NOTIFICATION_DOMAINS,
} from "./config.js";

let _cache = null;

export function loadArchitecture(force = false) {
  if (_cache && !force) return _cache;

  let arch;
  try {
    arch = readJson(ARCHITECTURE_FILE);
  } catch {
    arch = {};
  }

  const labels = arch.labels || {};
  const inboxLabels = new Set(
    Object.entries(labels)
      .filter(([, v]) => v.inbox === true)
      .map(([k]) => k)
  );

  _cache = {
    raw: arch,
    labels: labels,
    inboxLabels: inboxLabels.size ? inboxLabels : null,
    ignoreSenders: new Set(arch.overrides?.ignore_senders || []),
    senders: arch.overrides?.senders || {},
    domains: arch.overrides?.domains || {},
    senderPatterns: (arch.overrides?.sender_patterns || []).filter((p) => p.label),
    subjectPatterns: arch.overrides?.subject_patterns || [],
    keywords: {
      ai: arch.keywords?.ai || AI_KEYWORDS,
      action: arch.keywords?.action || ACTION_KEYWORDS,
      transaction: arch.keywords?.transaction || TRANSACTION_KEYWORDS,
      finance: arch.keywords?.finance || FINANCE_KEYWORDS,
      career: arch.keywords?.career || CAREER_KEYWORDS,
      promo: arch.keywords?.promo || PROMO_KEYWORDS,
      notification_domains: arch.keywords?.notification_domains || NOTIFICATION_DOMAINS,
    },
    heuristics: {
      people: {
        enabled: arch.heuristics?.people?.enabled !== false,
        free_email_domains: arch.heuristics?.people?.free_email_domains || [
          "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com",
        ],
        exclude_if_keywords_from: arch.heuristics?.people?.exclude_if_keywords_from || ["promo", "career"],
      },
    },
    reviewQueue: arch.review_queue?.pending || [],
  };

  return _cache;
}

/** Simple glob: only supports * at start/end/middle */
export function matchPattern(str, pattern) {
  const re = new RegExp(
    "^" + pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$",
    "i"
  );
  return re.test(str);
}

export function validateArchitecture() {
  const errors = [];
  const arch = loadArchitecture(true);
  const labelNames = new Set(LABELS.filter((l) => l !== "System/Processed"));

  const checkLabel = (label, ctx) => {
    if (!label) return;
    if (!labelNames.has(label) && label !== "System/Processed") {
      errors.push(`${ctx}: unknown label "${label}"`);
    }
  };

  for (const [sender, label] of Object.entries(arch.senders)) {
    checkLabel(label, `overrides.senders.${sender}`);
  }
  for (const [domain, label] of Object.entries(arch.domains)) {
    checkLabel(label, `overrides.domains.${domain}`);
  }
  for (const p of arch.senderPatterns) {
    checkLabel(p.label, `sender_patterns "${p.match}"`);
  }
  for (const p of arch.subjectPatterns) {
    checkLabel(p.label, `subject_patterns "${p.match}"`);
  }

  if (!fs.existsSync(ARCHITECTURE_FILE)) {
    errors.push(`Missing file: ${ARCHITECTURE_FILE}`);
  }

  return { valid: errors.length === 0, errors, architecture: arch.raw };
}
