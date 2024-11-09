import { Hono } from "hono";
import { type Hex, toHex } from "viem";
import { insertDidDb } from "../lib/db/actions/insert-did-db.js";
import { selectDidDb } from "../lib/db/actions/select-did-db.js";
import type { SelectDidDb } from "../lib/db/schema.js";
import { encodeDidResponse } from "../lib/did/utils.js";
import { validateDidMiddleware } from "../lib/middleware/validate-did-middleware.js";

type StatusCode = 200 | 404 | 500;

const didRouter = new Hono()
  .get("/:address", async (c) => {
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

      status = 404;
      const data = encodeDidResponse({
        signature: toHex("Base ID not found"),
        document: "empty",
        status,
      });

      return c.json({ data }, status);
    } catch (error) {
      status = 500;
      const errorMessage =
        error instanceof Error ? error.message : "Error selecting DID";
      return c.json({ error: errorMessage }, status);
    }
  })
  .post("/", validateDidMiddleware, async (c) => {
    const did = c.req.valid("json");
    const document = JSON.stringify(did.document);

    // Save did to database
    try {
      await insertDidDb({
        ...did,
        document,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error inserting DID";
      return c.json({ error: errorMessage }, 500);
    }

    return c.json({ ok: true, message: "DID inserted" }, 201);
  });

export { didRouter };
