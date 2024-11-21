import type { VerifiableCredential } from '@veramo/core';
import { Hono } from 'hono';

import { env } from '@/env.js';
import { insertCredentialDb } from '@/lib/db/actions/insert-credential-db.js';
import { createCredential } from '@/lib/veramo/actions/create-credential.js';
import { discordAuth } from '@hono/oauth-providers/discord';
import { getCookie } from 'hono/cookie';
import {
  deleteCookies,
  stateMiddleware,
} from './middlewares/state-middleware.js';

const verifyDiscordApp = new Hono();

verifyDiscordApp.get(
  '/verify/discord/:did?/:signature?/:callbackUrl?',
  stateMiddleware('discord'),
  discordAuth({
    client_id: env.DISCORD_OAUTH_CLIENT_ID,
    client_secret: env.DISCORD_OAUTH_CLIENT_SECRET,
    redirect_uri: env.DISCORD_OAUTH_REDIRECT_URI,
    scope: ['identify', 'email'],
  }),
  async (c) => {
    const did = getCookie(c, 'did');
    const callbackUrl = getCookie(c, 'callbackUrl');
    const user = c.get('user-discord');

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
          platform: 'discord',
          platformUserId: user.id,
          handle: user.username,
          verifiedAt: new Date().toISOString(),
          platformProfileUrl: `https://discordapp.com/users/${user.id}`,
        },
      });
      const issuer =
        typeof credential.issuer === 'string'
          ? credential.issuer
          : credential.issuer.id;

      await insertCredentialDb({
        issuer,
        subject: did,
        category: 'social',
        type: 'discord',
        credential,
      });
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

export { verifyDiscordApp };
