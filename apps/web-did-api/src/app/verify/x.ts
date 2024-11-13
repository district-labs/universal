import { Hono } from 'hono';
import { xAuth } from '@hono/oauth-providers/x';
import { createMiddleware } from 'hono/factory';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { createCredential } from '../../lib/veramo/actions/create-credential.js';
import type { VerifiableCredential } from '@veramo/core';
import { isAddress } from 'viem';

if (
  !process.env.TWITTER_OAUTH_CLIENT_ID ||
  !process.env.TWITTER_OAUTH_CLIENT_SECRET ||
  !process.env.TWITTER_OAUTH_REDIRECT_URI
) {
  throw new Error('Invalid Twitter OAuth credentials');
}

const verifyXApp = new Hono();


const stateMiddleware = createMiddleware<{
  Variables: {
    refereer: string | undefined;
  };
}>(async (c, next) => {
  const refereer = c.req.header('Referer');
  const did = c.req.param('did');
  const signature = c.req.param('signature');

  // TODO: add encrypted cookie
  if (typeof refereer === 'string') {
    setCookie(c, 'refereer', refereer);
  }
  if (typeof did === 'string' && typeof signature === 'string') {
    setCookie(c, 'did', did);
    setCookie(c, 'signature', signature);
  }
  await next();
});

function getDidUis(did: string) {
  const parts = did.split(':');

  if (parts.length !== 5) {
    return null;
  }

  if (parts[0] !== 'did') {
    return null;
  }

  if (parts[1] !== 'uis') {
    return null;
  }

  const chainId = Number(parts[2])
  const resolver = parts[3];
  const address = parts[4];

  if (Number.isNaN(chainId)) {
    return null;
  }

  if (!isAddress(address)) {
    return null;
  }

  if (!isAddress(resolver)) {
    return null;
  }

  return {
    chainId,
    resolver,
    address,
  };
}

const didValidationMiddleware = createMiddleware(async (c, next) => {
  const did = getCookie(c, 'did');
  const signature = getCookie(c, 'signature');

  if (!did || !signature) {
    return c.json({ error: 'Missing did or signature' }, 400);
  }

  const didUis = getDidUis(did);

  if (!didUis) {
    return c.json({ error: 'Invalid did' }, 400);
  }

  await next();
})

// X verification
verifyXApp.get(
  '/verify/x/:did?/:signature?',
  stateMiddleware,
  xAuth({
    scope: ['tweet.read', 'users.read'],
    fields: ['url', 'profile_image_url', 'username', 'id'],
    client_id: process.env.TWITTER_OAUTH_CLIENT_ID,
    client_secret: process.env.TWITTER_OAUTH_CLIENT_SECRET,
    redirect_uri: process.env.TWITTER_OAUTH_REDIRECT_URI,
  }),
  async (c) => {
    const did = getCookie(c, 'did');
    const refereerCookie = getCookie(c, 'refereer');
    const user = c.get('user-x');

    // Clean up cookies
    deleteCookie(c, 'refereer');
    deleteCookie(c, 'did');
    deleteCookie(c, 'signature');

    if (!did) {
      return c.json({ error: 'Failed to get did' }, 500)
    }

    if (!user?.username || !user?.id) {
      return c.json({ error: 'Failed to get user' }, 500)
    }

    let credential: VerifiableCredential

    try {
      credential = await createCredential({
        credentialSubject: {
          id: did,
          platform: 'x',
          platformUserId: user.id,
          handle: `@${user.username}`,
          verifiedAt: new Date().toISOString(),
          platformProfileUrl: `https://x.com/${user.username}`,
        }
      })
    } catch (e) {
      console.error(e);
      return c.json({ error: 'Failed to create credential' }, 500);
    }


    if (typeof refereerCookie === 'string') {
      // Parse the credential as a query param on redirect
      const encodedCredential = btoa(JSON.stringify(credential));
      const redirectUrl = new URL(refereerCookie);
      redirectUrl.searchParams.set('credential', encodedCredential);

      return c.redirect(redirectUrl);
    }

    return c.json(
      {
        credential
      },
      200,
    );
  },
);


export { verifyXApp };