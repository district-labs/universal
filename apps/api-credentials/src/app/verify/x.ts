import { Hono } from 'hono';
import { xAuth } from '@hono/oauth-providers/x';
import type { VerifiableCredential } from '@veramo/core';

import { getCookie } from 'hono/cookie';
import { createCredential } from '../../lib/veramo/actions/create-credential.js';
import {
  deleteCookies,
  stateMiddleware,
} from './middlewares/state-middleware.js';
import { insertCredentialDb } from '../../lib/db/actions/insert-credential-db.js';

if (
  !process.env.TWITTER_OAUTH_CLIENT_ID ||
  !process.env.TWITTER_OAUTH_CLIENT_SECRET ||
  !process.env.TWITTER_OAUTH_REDIRECT_URI
) {
  throw new Error('Invalid Twitter OAuth credentials');
}

const verifyXApp = new Hono();

verifyXApp.get(
  '/verify/x/:did?/:signature?/:callbackUrl?',
  stateMiddleware('x'),
  xAuth({
    scope: ['tweet.read', 'users.read'],
    fields: ['url', 'profile_image_url', 'username', 'id'],
    client_id: process.env.TWITTER_OAUTH_CLIENT_ID,
    client_secret: process.env.TWITTER_OAUTH_CLIENT_SECRET,
    redirect_uri: process.env.TWITTER_OAUTH_REDIRECT_URI,
  }),
  async (c) => {
    const did = getCookie(c, 'did');
    const callbackUrl = getCookie(c, 'callbackUrl');
    const user = c.get('user-x');

    // Delete cookies after use
    deleteCookies(c);

    if (!did) {
      return c.json({ error: 'Failed to get did' }, 500);
    }

    if (!user?.username || !user?.id) {
      return c.json({ error: 'Failed to get user' }, 500);
    }

    let credential: VerifiableCredential;

    try {
      credential = await createCredential({
        credentialSubject: {
          id: did,
          platform: 'x',
          platformUserId: user.id,
          handle: `@${user.username}`,
          verifiedAt: new Date().toISOString(),
          platformProfileUrl: `https://x.com/${user.username}`,
        },
      });

      const issuer = typeof credential.issuer === 'string' ? credential.issuer : credential.issuer.id;

      await insertCredentialDb({
        issuer,
        subject: did,
        category: "social",
        type: "x",
        credential
      })
    } catch (e) {
      console.error(e);
      return c.json({ error: 'Failed to create credential' }, 500);
    }

    if (typeof callbackUrl === 'string') {
      // Parse the credential as a query param on redirect
      const encodedCredential = btoa(JSON.stringify(credential));
      const redirectUrl = new URL(callbackUrl);
      redirectUrl.searchParams.set('credential', encodedCredential);

      return c.redirect(redirectUrl);
    }

    return c.json(
      {
        credential,
      },
      200,
    );
  },
);

export { verifyXApp };
