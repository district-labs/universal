import { validator } from "hono/validator";
import { universalDeployments } from "universal-data";
import {
	type PostDid,
	didDocumentSchema,
	postDidSchema,
} from "../validation/did.js";
import { getPublicClient } from "../viem/index.js";

function validateSignature(did: PostDid) {
	const publicClient = getPublicClient(did.chainId);
	const resolver = universalDeployments?.[did.chainId]?.resolver;
	if (!resolver) {
		throw new Error(`Invalid resolver address ad chainId: ${did.chainId}`);
	}

	return publicClient.verifyTypedData({
		address: did.address,
		domain: {
			name: "Universal Resolver",
			version: "1",
			chainId: did.chainId,
			verifyingContract: resolver,
		},
		primaryType: "UniversalDID",
		types: {
			UniversalDID: [
				{
					name: "document",
					type: "string",
				},
			],
		},
		message: {
			document: did.document,
		},
		signature: did.signature,
	});
}

// Validates the Did values through onchain calls and signature verification
export const validateDidMiddleware = validator("json", async (value, c) => {
	// Validates the did schema
	const parsedDid = postDidSchema.safeParse(value);
	if (!parsedDid.success) {
		return c.json({ error: "Invalid request" }, 400);
	}
	const parsedDocument = didDocumentSchema.safeParse(
		JSON.parse(parsedDid.data.document),
	);

	if (!parsedDocument.success) {
		return c.json({ error: "Invalid did" }, 400);
	}
	const did = parsedDid.data;

	const validSignature = await validateSignature(did);

	if (!validSignature) {
		return c.json({ error: "Invalid signature" }, 400);
	}

	return did;
});
