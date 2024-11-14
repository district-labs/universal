import { Hono } from "hono";
import { getCredentialDb } from "../../lib/db/actions/get-credential-db.js";

const credentialsApp = new Hono().get('/credentials/:did', async (c) => {
  const subject = c.req.param("did")
  const issuer = c.req.query("issuer")
  const category = c.req.query("category")
  const type = c.req.query("type")

  const credentials = await getCredentialDb({ issuer, subject, category, type })

  if (!credentials) {
    return c.json({ error: 'No credentials found' }, 404);
  }

  return c.json({ credentials }, 200);
})

export { credentialsApp }