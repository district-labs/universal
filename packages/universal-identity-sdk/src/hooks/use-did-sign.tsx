import type { Address } from "viem";
import { useChainId, useSignTypedData } from "wagmi";
import { useInsertUniversalDid } from "../api/hooks/insert-universal-did.js";
import { eip712UniversalDidType } from "../eip712-universal-did-type.js";
import type { IdentityApiClient } from "../api/client.js";

type SignDidParams = {
	address: Address;
	verifyingContract: Address;
	document: string;
};

export function useDidSign(identityApiClient: IdentityApiClient) {
	const { mutateAsync } = useInsertUniversalDid(identityApiClient);
	const chainId = useChainId();
	const { data, signTypedData, signTypedDataAsync, ...rest } =
		useSignTypedData();

	async function signAndSaveDid({
		verifyingContract,
		document,
		address,
	}: SignDidParams) {
		const signature = await signTypedDataAsync({
			types: eip712UniversalDidType,
			primaryType: "UniversalDID",
			domain: {
				name: "Universal Resolver",
				version: "1",
				chainId: chainId,
				verifyingContract: verifyingContract,
			},
			message: {
				document: document,
			},
		});
		await mutateAsync({
			chainId: chainId,
			document: document,
			address: address,
			signature: signature,
			resolver: verifyingContract,
		});

		return signature;
	}

	return {
		data,
		signAndSaveDid,
		...rest,
	};
}
