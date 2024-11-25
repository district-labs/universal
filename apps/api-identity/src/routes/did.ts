import { Hono } from 'hono';
import { type Hex, toHex } from 'viem';
import { insertDidDb } from '../lib/db/actions/insert-did-db.js';
import { selectDidDb } from '../lib/db/actions/select-did-db.js';
import type { SelectDidDb } from '../lib/db/schema.js';
import { encodeDidResponse } from '../lib/did/utils.js';
import { getIdentifier } from '../lib/get-identifier.js';
import { validateDidMiddleware } from '../lib/middleware/validate-did-middleware.js';

type StatusCode = 200 | 404 | 500;

const didRouter = new Hono()
  .get('/:sender/:address', async (c) => {
    const { address } = c.req.param();
    let status: StatusCode = 200;

    try {
      const did: SelectDidDb | undefined = await selectDidDb(address);
      if (did) {
        const data = encodeDidResponse({
          document: did.document,
          signature: did.signature as Hex,
          status,
        });
        return c.json({ data }, status);
      }

      // We use 500 to indicate that the DID and following the EIP-3668
      // should try another URL to resolve the DID.
      status = 500;
      const data = encodeDidResponse({
        signature: toHex(''),
        document: '',
        status,
      });

      return c.json({ data }, status);
    } catch (error) {
      status = 500;
      const errorMessage =
        error instanceof Error ? error.message : 'Error selecting DID';
      return c.json({ error: errorMessage }, status);
    }
  })
  .post('/', validateDidMiddleware, async (c) => {
    const did = c.req.valid('json');
    const identifier = await getIdentifier(did);
    try {
      await insertDidDb({
        address: did.address,
        resolver: did.resolver,
        identifier: identifier,
        document: did.document,
        signature: did.signature,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error inserting DID';
      return c.json({ error: errorMessage }, 500);
    }
    return c.json({ ok: true, message: 'DID inserted' }, 201);
  });

export { didRouter };
