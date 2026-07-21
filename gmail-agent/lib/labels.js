import { LABELS } from "./config.js";

export async function listLabels(gmail) {
  const res = await gmail.users.labels.list({ userId: "me" });
  const map = {};
  for (const l of res.data.labels || []) map[l.name] = l.id;
  return map;
}

export async function ensureLabels(gmail) {
  const existing = await listLabels(gmail);
  for (const name of LABELS) {
    if (!existing[name]) {
      const created = await gmail.users.labels.create({
        userId: "me",
        requestBody: {
          name,
          labelListVisibility: "labelShow",
          messageListVisibility: "show",
        },
      });
      existing[name] = created.data.id;
      console.log(`  Created label: ${name}`);
    } else {
      console.log(`  Label exists: ${name}`);
    }
  }
  const result = {};
  for (const name of LABELS) result[name] = existing[name];
  return result;
}
