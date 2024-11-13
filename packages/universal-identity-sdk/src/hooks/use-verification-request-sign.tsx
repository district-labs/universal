import { zeroAddress } from "viem";
import { useChainId, useSignTypedData } from "wagmi";
import { eip712VerificationRequestType } from "../eip712-verification-request-type.js";

type VerificationRequestSignParams = {
	id: string;
	type: string;
};

export function useVerificationRequestSign() {
	const chainId = useChainId();
	const { data, signTypedData, signTypedDataAsync, ...rest } =
		useSignTypedData();

	async function signVerificationRequestAsync({
		id,type
	}: VerificationRequestSignParams) {
		return await signTypedDataAsync({
			types: eip712VerificationRequestType,
			primaryType: "VerificationRequest",
			domain: {
				name: "Universal Resolver",
				version: "1",
				chainId: chainId,
				verifyingContract: zeroAddress,
			},
			message: {
				id: id,
				type: type,
			},
		});
	}

	return {
		data,
		signVerificationRequestAsync,
		...rest,
	};
}
