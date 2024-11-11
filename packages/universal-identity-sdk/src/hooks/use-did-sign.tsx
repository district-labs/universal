import { type Address } from "viem";
import { useChainId, useSignTypedData } from "wagmi";
import { eip712UniversalDidType } from "../eip712-universal-did-type.js";

type SignDidParams = {
	verifyContract: Address;
	document: string;
};

export function useDidSign() {
	const chainId = useChainId();
	const { data, signTypedData, signTypedDataAsync, ...rest } =
		useSignTypedData();

	async function signAndSaveDid({ verifyContract, document }: SignDidParams) {
		await signTypedDataAsync({
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
	}

	return {
		data,
		signAndSaveDid,
		...rest,
	};
}
