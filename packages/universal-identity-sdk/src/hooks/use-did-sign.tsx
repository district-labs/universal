import { type Address } from "viem";
import { useChainId, useSignTypedData } from "wagmi";
import { eip712UniversalDidType } from "../eip712-universal-did-type.js";
import { useInsertUniversalDid } from "../api/hooks/insert-universal-did.js";

type SignDidParams = {
	address: Address;
	verifyContract: Address;
	document: string;
};

export function useDidSign() {
	const { mutateAsync } = useInsertUniversalDid();
	const chainId = useChainId();
	const { data, signTypedData, signTypedDataAsync, ...rest } =
		useSignTypedData();

	async function signAndSaveDid({
		verifyContract,
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
				verifyingContract: verifyContract,
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
		});

		return signature;
	}

	return {
		data,
		signAndSaveDid,
		...rest,
	};
}
