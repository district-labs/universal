import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { getDelegationsDb } from "../db/actions/delegations/get-delegations-db.js";
import type { SelectDelegationDb } from "../db/schema.js";
import { insertDelegationDb } from "../db/actions/delegations/insert-delegation-db.js";
import { invalidateDelegationDb } from "../db/actions/delegations/invalidate-delegation-db.js";
import { getDelegationsByDelegatorDb } from "../db/actions/delegations/get-delegations-by-delegator-db.js";
import { getDelegationsByDelegatorAndTypeDb } from "../db/actions/delegations/get-delegations-by-delegator-and-type-db.js";
import { getDelegationsByDelegateDb } from "../db/actions/delegations/get-delegations-by-delegatedb.js";
import { getDelegationsByDelegateAndTypeDb } from "../db/actions/delegations/get-delegations-by-delegate-and-type-db.js";

const getDelegationSchema = z.object({
  hash: z.string().refine((val) => val.length === 66 && val.startsWith("0x"), {
    message: "invalid hash",
  }),
});

const getDelegationByDelegatorOrDelegateSchema = z.object({
  address: z.string().refine((val) => val.length > 10 && val.startsWith("0x"), {
    message: "invalid address",
  }),
});

const getDelegationByDelegatorOrDelegateWithTypeSchema = z.object({
  address: z.string().refine((val) => val.length > 10 && val.startsWith("0x"), {
    message: "invalid address",
  }),
  type: z.string().refine((val) => val.length > 0, {
    message: "invalid type",
  }),
});

const postDelegationSchema = z.object({
  hash: z.string(),
  verifyingContract: z.string(),
  type: z.string(),
  delegator: z.string(),
  chainId: z.number(),
  delegate: z.string(),
  authority: z.string(),
  salt: z.number(),
  signature: z.string(),
  caveats: z.array(
    z.object({
      enforcerType: z.string(),
      enforcer: z.string(),
      terms: z.string(),
      args: z.string(),
    }),
  ),
});

const delegationsRouter = new Hono()

  // Get a delegation by its hash
  .get("/:hash", zValidator("param", getDelegationSchema), async (c) => {
    const { hash } = c.req.valid("param");
    const delegation: SelectDelegationDb | undefined = await getDelegationsDb({
      hash,
    });

    if (delegation) {
      return c.json({ delegation }, 200);
    }

    return c.json({ error: "delegation not found" }, 404);
  })

  // Get a delegations by its delegator
  .get("/delegator/:address", zValidator("param", getDelegationByDelegatorOrDelegateSchema), async (c) => {
    const { address } = c.req.valid("param");
    const delegations: SelectDelegationDb[] | undefined = await getDelegationsByDelegatorDb({
      delegator: address,
    });

    if (delegations) {
      return c.json({ delegations }, 200);
    }

    return c.json({ error: "delegations not found" }, 404);
  })
  
  // Get a delegations by its delegator
  .get("/delegator/:address/:type", zValidator("param", getDelegationByDelegatorOrDelegateWithTypeSchema), async (c) => {
    const { address, type } = c.req.valid("param");
    const delegations: SelectDelegationDb[] | undefined = await getDelegationsByDelegatorAndTypeDb({
      delegator: address,
      type,
    });

    if (delegations) {
      return c.json({ delegations }, 200);
    }

    return c.json({ error: "delegations not found" }, 404);
  })
 
  // Get a delegations by its delegator
  .get("/delegate/:address", zValidator("param", getDelegationByDelegatorOrDelegateSchema), async (c) => {
    const { address } = c.req.valid("param");
    const delegations: SelectDelegationDb[] | undefined = await getDelegationsByDelegateDb({
      delegate: address,
    });

    if (delegations) {
      return c.json({ delegations }, 200);
    }

    return c.json({ error: "delegations not found" }, 404);
  })
  
  // Get a delegations by its delegator
  .get("/delegate/:address/:type", zValidator("param", getDelegationByDelegatorOrDelegateWithTypeSchema), async (c) => {
    const { address, type } = c.req.valid("param");
    const delegations: SelectDelegationDb[] | undefined = await getDelegationsByDelegateAndTypeDb({
      delegate: address,
      type,
    });

    if (delegations) {
      return c.json({ delegations }, 200);
    }

    return c.json({ error: "delegations not found" }, 404);
  })


  .post(
    "/",
    zValidator("json", postDelegationSchema),
    // TODO: validate the signature of the delegation
    async (c) => {
      const delegation = c.req.valid("json");

      console.log(delegation, 'delegation WTF')

      // Save the delegation to the database
      try {
        await insertDelegationDb(delegation);
      } catch (error) {
        console.error(error);
        return c.json({ error: "failed to save delegation" }, 500);
      }

      return c.json({ delegation }, 200);
    },
  )
  .patch(
    "invalidate/:hash",
    zValidator("param", getDelegationSchema),
    // TODO: Expect a signature from the delegator to invalidate the delegation
    async (c) => {
      const { hash } = c.req.valid("param");
      const delegation: SelectDelegationDb[] | undefined =
        await invalidateDelegationDb({
          hash,
        });

      if (delegation && delegation.length > 0) {
        return c.json({ ok: true }, 200);
      }

      return c.json({ error: "delegation not found" }, 404);
    },
  );

export { delegationsRouter };
