import { Hono } from 'hono';
import { githubAuth } from '@hono/oauth-providers/github';
import type { VerifiableCredential } from '@veramo/core';

import { getCookie } from 'hono/cookie';
import { createCredential } from '../../lib/veramo/actions/create-credential.js';
import {
  deleteCookies,
  stateMiddleware,
} from './middlewares/state-middleware.js';
import { insertCredentialDb } from '../../lib/db/actions/insert-credential-db.js';

if (
  !process.env.GITHUB_OAUTH_CLIENT_ID ||
  !process.env.GITHUB_OAUTH_CLIENT_SECRET ||
  !process.env.GITHUB_OAUTH_REDIRECT_URI
) {
  throw new Error('Invalid GitHub OAuth credentials');
}

const verifyGithubApp = new Hono();

verifyGithubApp.get(
  '/verify/github/:did?/:signature?/:callbackUrl?',
  stateMiddleware("github"),
  githubAuth({
    client_id: process.env.GITHUB_OAUTH_CLIENT_ID,
    client_secret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
    redirect_uri: process.env.GITHUB_OAUTH_REDIRECT_URI,
    scope: ['read:user', 'user'],
  }),
  async (c) => {
    const did = getCookie(c, 'did');
    const callbackUrl = getCookie(c, 'callbackUrl');
    const user = c.get('user-github');

    // Delete cookies after use
    deleteCookies(c);

    if (!did) {
      return c.json({ error: 'Failed to get did' }, 500);
    }

    if (!user?.login || !user?.id) {
      return c.json({ error: 'Failed to get user' }, 500);
    }

    let credential: VerifiableCredential;

    try {
      credential = await createCredential({
        credentialSubject: {
          id: did,
          platform: 'github',
          platformUserId: user.id,
          handle: `@${user.login}`,
          verifiedAt: new Date().toISOString(),
          platformProfileUrl: `https://github.com/${user.login}`,
        },
      });
      const issuer = typeof credential.issuer === 'string' ? credential.issuer : credential.issuer.id;
      await insertCredentialDb({
        issuer,
        subject: did,
        category: "social",
        type: "github",
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

export { verifyGithubApp };
