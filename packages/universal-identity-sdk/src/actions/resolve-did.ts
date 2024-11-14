import type { DidDocument } from "api-identity";
import {
	type Account,
	type Address,
	type CallErrorType,
	type Chain,
	type Client,
	type Hex,
	type ReadContractErrorType,
	type Transport,
	encodePacked,
	zeroAddress,
} from "viem";
import { readContract } from "viem/actions";
import { resolverAbi } from "../abis.js";
import { deconstructDidIdentifier } from "../utils/deconstruct-did-identifier.js";
import { encodeServerDidResponse } from "../utils/encode-server-did-response.js";

export type ResolveUisParameters =
	| {
			id: string;
			address?: never;
			resolver?: never;
	  }
	| {
			address: Address;
			resolver: Address;
			id?: never;
	  };

export type ResolveUisReturnType = {
	status: number;
	signature: Hex;
	data: string;
	parsed: DidDocument;
};

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
export async function resolveDid<
	chain extends Chain | undefined,
	account extends Account | undefined,
>(
	client: Client<Transport, chain, account>,
	parameters: ResolveUisParameters,
): Promise<ResolveUisReturnType> {
	let address: Address;
	let resolver: Address;
	if (parameters.id) {
		const {
			resolver: _resolver,
			address: _address,
			status,
		} = deconstructDidIdentifier(parameters.id);
		if (status && _address && _resolver) {
			address = _address;
			resolver = _resolver;
		} else {
			address = zeroAddress;
			resolver = zeroAddress;
		}
	} else if (parameters.address && parameters.resolver) {
		address = parameters.address;
		resolver = parameters.resolver;
	} else {
		address = zeroAddress;
		resolver = zeroAddress;
	}

	if (address === zeroAddress || resolver === zeroAddress)
		throw new Error("Invalid DID format.");

	try {
		const data = await readContract(client, {
			abi: resolverAbi,
			address: resolver,
			functionName: "lookup",
			args: [address],
		});
		return {
			...data,
			parsed: JSON.parse(data.data),
		};
	} catch (error) {
		const data = await readContract(client, {
			abi: resolverAbi,
			address: resolver,
			functionName: "resolve",
			args: [
				encodeServerDidResponse({
					status: 404,
					signature: "0x",
					document: "0x",
				}),
				encodePacked(["address"], [address]),
			],
		});
		return {
			...data,
			parsed: JSON.parse(data.data),
		};
	}
}
