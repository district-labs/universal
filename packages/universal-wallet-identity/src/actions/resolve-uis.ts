import {
	encodePacked,
	type Account,
	type Address,
	type CallErrorType,
	type Chain,
	type Client,
	type ReadContractErrorType,
	type Transport,
} from "viem";
import { readContract } from "viem/actions";
import { resolverAbi } from "../abis.js";
import { encodeDidResponse } from "../utils/encode-did-response.js";

export type ResolveUisParameters = {
	address: Address;
	resolver: Address;
};

export type ResolveUisReturnType = string;

export type ResolveUisErrorType = CallErrorType | ReadContractErrorType;

/**
 *  Resolves the DID document for a given address using the Universal Identity Resolver.
 *
 * - Docs: TODO
 *
 * @param client - Client to use
 * @param parameters - {@link ResolveUisParameters}
 * @returns The prove transaction hash. {@link ResolveUisReturnType}
 *
 */
export async function resolveUis<
	chain extends Chain | undefined,
	account extends Account | undefined,
>(
	client: Client<Transport, chain, account>,
	parameters: ResolveUisParameters,
): Promise<ResolveUisReturnType> {
	const { address, resolver } = parameters;
	try {
		return await readContract(client, {
			abi: resolverAbi,
			address: resolver,
			functionName: "lookup",
			args: [address],
		});
	} catch (error) {
		return await readContract(client, {
			abi: resolverAbi,
			address: resolver,
			functionName: "resolve",
			args: [
				encodeDidResponse({
					status: 404,
					signature: "0x",
					document: "0x",
				}),
				encodePacked(["address"], [address]),
			],
		});
	}
}
