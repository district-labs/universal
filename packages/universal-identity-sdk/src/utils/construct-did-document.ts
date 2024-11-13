import type { Address } from "viem";

export type ConstructDidDocumentParameters = {
	address: Address;
	resolver: Address;
	chainId: number;
};

export function constructDidDocument(
	parameters: ConstructDidDocumentParameters,
) {
	const { address, chainId, resolver } = parameters;

	const id = `did:uis:${chainId}:${resolver}:${address}`;

	const document = {
		"@context": ["https://www.w3.org/ns/did/v1"],
		id,
		verificationMethod: [
			{
				id: `${id}#controller-key`,
				type: "EthEip6492",
				controller: id,
			},
		],
		authentication: [`${id}#controller-key`],
		assertionMethod: [`${id}#controller-key`],
	};

	return document;
}
