import fs from "fs";
import http from "http";
import net from "net";
import { URL } from "url";
import { google } from "googleapis";
import {
  CREDENTIALS_FILE,
  SCOPES,
  TOKEN_FILE,
  ensureGmailDir,
} from "./config.js";

export function credentialsReady() {
  return fs.existsSync(CREDENTIALS_FILE);
}

export function tokenReady() {
  return fs.existsSync(TOKEN_FILE);
}

function loadCredentials() {
  const raw = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, "utf8"));
  const creds = raw.installed || raw.web || raw;
  return {
    clientId: creds.client_id,
    clientSecret: creds.client_secret,
  };
}

function findAvailablePort(start = 44000, end = 44100) {
  return new Promise((resolve, reject) => {
    const tryPort = (port) => {
      if (port > end) {
        reject(new Error(`No free port between ${start} and ${end}`));
        return;
      }
      const tester = net.createServer()
        .once("error", () => tryPort(port + 1))
        .once("listening", () => {
          tester.close(() => resolve(port));
        })
        .listen(port, "127.0.0.1");
    };
    tryPort(start);
  });
}

async function authorizeInteractive() {
  const { clientId, clientSecret } = loadCredentials();
  const port = await findAvailablePort();
  const redirectUri = `http://127.0.0.1:${port}`;
  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });

  console.log("\nOpening browser for Gmail authorization...");
  console.log(`Listening on ${redirectUri}`);
  console.log("If browser does not open, visit:\n", authUrl, "\n");

  const code = await new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        const url = new URL(req.url, redirectUri);
        const authCode = url.searchParams.get("code");
        const error = url.searchParams.get("error");
        if (error) {
          res.writeHead(400, { "Content-Type": "text/html" });
          res.end(`<h1>Authorization failed</h1><p>${error}</p>`);
          server.close();
          reject(new Error(`OAuth error: ${error}`));
          return;
        }
        if (authCode) {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end("<h1>Authorization successful!</h1><p>You can close this tab.</p>");
          server.close();
          resolve(authCode);
        }
      } catch (err) {
        server.close();
        reject(err);
      }
    });

    server.on("error", reject);
    server.listen(port, "127.0.0.1", () => {
      import("child_process").then(({ exec }) => {
        exec(`open "${authUrl}"`);
      });
    });
  });

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2));
  return oauth2Client;
}

export async function getGmail() {
  ensureGmailDir();
  if (!credentialsReady()) {
    console.error(`\nMissing OAuth credentials at:\n  ${CREDENTIALS_FILE}\n`);
    console.error("See docs/GMAIL-SETUP.md for setup steps.\n");
    process.exit(1);
  }

  const { clientId, clientSecret } = loadCredentials();
  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);

  if (tokenReady()) {
    oauth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_FILE, "utf8")));
  }

  if (!oauth2Client.credentials.access_token) {
    await authorizeInteractive();
    oauth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_FILE, "utf8")));
  }

  if (oauth2Client.credentials.expiry_date && oauth2Client.credentials.expiry_date < Date.now()) {
    const { credentials } = await oauth2Client.refreshAccessToken();
    oauth2Client.setCredentials(credentials);
    fs.writeFileSync(TOKEN_FILE, JSON.stringify(credentials, null, 2));
  }

  return google.gmail({ version: "v1", auth: oauth2Client });
}

export async function profileEmail(gmail) {
  const profile = await gmail.users.getProfile({ userId: "me" });
  return profile.data.emailAddress || "unknown";
}
