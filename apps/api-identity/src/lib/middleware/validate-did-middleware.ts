import { validator } from "hono/validator";

import { resolverAbi } from "../config/abis.js";
import { CONTRACTS } from "../config/contracts.js";
import { type PostDid, postDidSchema } from "../validation/did.js";
import { getPublicClientFromList } from "../viem/index.js";

function getIdentifier(did: PostDid) {
  const publicClient = getPublicClientFromList(did.chainId);

  return publicClient.readContract({
    address: CONTRACTS.resolver,
    abi: resolverAbi,
    functionName: "getAddress",
    args: [did.address],
  });
}

function validateSignature(did: PostDid) {
  const publicClient = getPublicClientFromList(did.chainId);

  return publicClient.verifyTypedData({
    address: did.address,
    domain: {
      chainId: did.chainId,
      verifyingContract: CONTRACTS.resolver,
    },
    primaryType: "DID",
    types: {
      DID: [
        {
          name: "document",
          type: "string",
        },
      ],
    },
    message: {
      document: JSON.stringify(did.document),
    },
    signature: did.signature,
  });
}

// Validates the Did values through onchain calls and signature verification
export const validateDidMiddleware = validator("json", async (value, c) => {
  // Validates the did schema
  const parsedDid = postDidSchema.safeParse(value);
  if (!parsedDid.success) {
    return c.json({ error: "Invalid did" }, 400);
  }
  const did = parsedDid.data;

  // Validate the identifier address and signature
  const [identifier, validSignature] = await Promise.all([
    getIdentifier(did),
    validateSignature(did),
  ]);

  if (identifier !== did.identifier) {
    return c.json({ error: "Invalid identifier" }, 400);
  }

  if (!validSignature) {
    return c.json({ error: "Invalid signature" }, 400);
  }

  return did;
});
