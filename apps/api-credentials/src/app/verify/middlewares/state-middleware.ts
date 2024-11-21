import { baseSepoliaPublicClient } from '@/lib/viem/client.js';
import type { Context } from 'hono';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';
import { type Hex, isAddress, isHex } from 'viem';
import { baseSepolia } from 'viem/chains';

const eip712VerificationRequestType = {
  VerificationRequest: [
    {
      name: 'id',
      type: 'string',
    },
    {
      name: 'type',
      type: 'string',
    },
  ],
};

async function verifyDidSignature({
  did,
  signature,
  type,
}: { did: string; signature: Hex; type: string }) {
  const didUis = getDidUis(did);

  if (!didUis) {
    return false;
  }

  const { address, chainId } = didUis;

  // Only supporting baseSepolia fow now
  if (chainId !== baseSepolia.id) {
    return false;
  }

  const isValidSignature = await baseSepoliaPublicClient.verifyTypedData({
    signature,
    address,
    types: eip712VerificationRequestType,
    primaryType: 'VerificationRequest',
    domain: {
      name: 'Universal Resolver',
      version: '1',
      chainId: chainId,
    },
    message: {
      id: did,
      type,
    },
  });

  return isValidSignature;
}

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
    return null;
  }

  if (typeof address !== 'string' || !isAddress(address)) {
    return null;
  }

  if (typeof resolver !== 'string' || !isAddress(resolver)) {
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
  deleteCookie(c, 'type');
}

export const stateMiddleware = (type: string) =>
  createMiddleware(async (c, next) => {
    const callbackUrl = getParamOrCookie(c, 'callbackUrl');
    const did = getParamOrCookie(c, 'did');
    const signature = getParamOrCookie(c, 'signature');

    if (!did || !isHex(signature)) {
      return c.json({ error: 'Missing did or signature' }, 400);
    }

    const isValidSignature = await verifyDidSignature({
      did,
      signature,
      type,
    });

    if (!isValidSignature) {
      return c.json({ error: 'Invalid signature' }, 400);
    }

    // TODO: add encrypted cookie
    if (typeof callbackUrl === 'string') {
      setCookie(c, 'callbackUrl', callbackUrl);
    }
    if (typeof did === 'string' && typeof signature === 'string') {
      setCookie(c, 'did', did);
      setCookie(c, 'signature', signature);
    }

    return await next();
  });
