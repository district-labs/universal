import { createMiddleware } from 'hono/factory';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import { isAddress } from 'viem';
import type { Context } from 'hono';

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

  const chainId = Number(parts[2]);
  const resolver = parts[3];
  const address = parts[4];


  if (Number.isNaN(chainId)) {
    console.log("invalid chainId")
    return null;
  }

  if (!isAddress(address)) {
    console.log("invalid address")
    return null;
  }

  if (!isAddress(resolver)) {
    console.log("invalid resolver")
    return null;
  }

  return {
    chainId,
    resolver,
    address,
  };
}

function getParamOrCookie<C extends Context>(c: C, key: string) {
  // The param value will be used in the first request, and the cookie value will be used after the oauth callback
  const param = c.req.param(key);
  if (typeof param === 'string' && param.length > 0) {
    return param;
  }
  const cookie = getCookie(c, key);
  return cookie;
}

export function deleteCookies<C extends Context>(c: C) {
  deleteCookie(c, 'callbackUrl');
  deleteCookie(c, 'did');
  deleteCookie(c, 'signature');

}

export const stateMiddleware = createMiddleware(async (c, next) => {
  const callbackUrl = getParamOrCookie(c, 'callbackUrl');
  const did = getParamOrCookie(c, 'did');
  const signature = getParamOrCookie(c, 'signature');

  if (!did || !signature) {
    return c.json({ error: 'Missing did or signature' }, 400);
  }
  const didUis = getDidUis(did);

  if (!didUis) {
    return c.json({ error: 'Invalid did' }, 400);
  }

  // TODO: add encrypted cookie
  if (typeof callbackUrl === 'string') {
    setCookie(c, 'callbackUrl', callbackUrl);
  }
  if (typeof did === 'string' && typeof signature === 'string') {
    setCookie(c, 'did', did);
    setCookie(c, 'signature', signature);
  }

  await next();

});
