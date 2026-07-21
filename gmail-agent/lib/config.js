import fs from "fs";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../..");
const DOCS_DIR = path.join(REPO_ROOT, "docs");

export const GMAIL_DIR = path.join(os.homedir(), ".gmail-mcp");
export const CREDENTIALS_FILE = path.join(GMAIL_DIR, "credentials.json");
export const TOKEN_FILE = path.join(GMAIL_DIR, "token.json");
export const SENDER_MAP_FILE = path.join(DOCS_DIR, "gmail-sender-map.json");
export const ARCHITECTURE_FILE = path.join(DOCS_DIR, "gmail", "gmail_architecture.json");
export const DAILY_BRIEF_FILE = path.join(DOCS_DIR, "gmail-daily-brief.md");

export const SCOPES = ["https://www.googleapis.com/auth/gmail.modify"];

export const LABELS = [
  "Priority/People",
  "Priority/Action Required",
  "Read/AI and Tech",
  "Read/Newsletters",
  "Transactions/Purchases",
  "Transactions/Finance",
  "Work/Career",
  "System/Notifications",
  "System/Promotions",
  "System/Processed",
];

export const INBOX_LABELS = new Set([
  "Priority/People",
  "Priority/Action Required",
  "Read/AI and Tech",
]);

export const AI_KEYWORDS = [
  "ai", "artificial intelligence", "openai", "anthropic", "claude", "cursor",
  "hugging face", "huggingface", "gemini", "copilot", "llm", "machine learning",
  "deep learning", "arxiv", "substack", "mistral", "perplexity", "midjourney",
  "stability ai", "langchain", "nvidia ai", "google ai", "meta ai",
];

export const ACTION_KEYWORDS = [
  "action required", "confirm your", "verify your", "deadline", "rsvp",
  "signature needed", "please respond", "response required", "expires",
  "invitation:", "accepted:", "declined:", "security alert",
];

export const TRANSACTION_KEYWORDS = [
  "order confirmation", "your order", "receipt", "invoice", "shipment",
  "tracking number", "delivered", "payment received", "purchase",
];

export const FINANCE_KEYWORDS = [
  "bank", "statement", "bill", "payment due", "tax", "wire transfer",
  "account balance", "credit card",
];

export const CAREER_KEYWORDS = [
  "job alert", "application received", "interview", "recruiter",
  "greenhouse", "lever.co", "workday", "indeed", "linkedin jobs",
  "careers@", "hiring",
];

export const PROMO_KEYWORDS = [
  "unsubscribe", "sale", "discount", "% off", "limited time", "deal",
  "promo", "coupon", "flash sale", "shop now",
];

export const NOTIFICATION_DOMAINS = [
  "github.com", "linkedin.com", "facebookmail.com", "accounts.google.com",
  "noreply.github.com", "slack.com", "discord.com", "twitter.com", "x.com",
];

export const AUDIT_DAYS = 90;
export const BATCH_SIZE = 50;

export function ensureGmailDir() {
  fs.mkdirSync(GMAIL_DIR, { recursive: true });
}

export function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

export function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}
