import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { xAuth } from "@hono/oauth-providers/x"
import { createCredential } from "../lib/veramo/actions/create-credential.js";
import { webDid } from "../lib/veramo/data/did.js";
import { verifyCredential } from "../lib/veramo/actions/verify-credential.js";

if (!process.env.TWITTER_OAUTH_CLIENT_ID || !process.env.TWITTER_OAUTH_CLIENT_SECRET || !process.env.TWITTER_OAUTH_REDIRECT_URI) {
  throw new Error("Invalid Twitter OAuth credentials");
}

const app = new Hono();

app.get("/.well-known/did.json", (c) => {
  return c.json(webDid, 200);
});

// TODO: Add body validation
app.post("/issue-credential", async (c) => {
  try {
    const body = await c.req.json();

    if (
      !body?.credentialSubject ||
      typeof body?.credentialSubject !== "object"
    ) {
      return c.json({ error: "credentialSubject is required" }, 400);
    }
    const { credentialSubject } = body;

    const result = await createCredential({ credentialSubject });
    return c.json({ ok: true, credential: result }, 200);
  } catch (e) {
    console.error(e);
    return c.json({ error: "Failed to create credential" }, 500);
  }
});

// TODO: Add body validation
app.post("/verify-credential", async (c) => {
  try {
    console.log(c.req);
    const body = await c.req.json();

    if (!body?.credential || typeof body?.credential !== "object") {
      return c.json({ error: "credential is required" }, 400);
    }
    const { credential } = body;

    const result = await verifyCredential({ credential });
    return c.json({ result }, 200);
  } catch (e) {
    console.error(e);

    return c.json({ error: "Failed to verify credential" }, 500);
  }
});

app.use("/verify/x", xAuth({
  scope: ["users.read"],
  client_id: process.env.TWITTER_OAUTH_CLIENT_ID,
  client_secret: process.env.TWITTER_OAUTH_CLIENT_SECRET,
  redirect_uri: process.env.TWITTER_OAUTH_REDIRECT_URI,
}))
// X verification
app.get("/verify/x", (c) => {
  const token = c.get('token')
  const grantedScopes = c.get('granted-scopes')
  const user = c.get('user-x')
  return c.json({
    token,
    grantedScopes,
    user,
  }, 200);
});

const port = 8787;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
