import { z } from "zod";
import { zeroAddress, type Address } from "viem";

const didSchema = z
	.string()
	.regex(/^did:uis:\d+:0x[a-fA-F0-9]{40}:0x[a-fA-F0-9]{40}$/, {
		message: "Invalid DID format.",
	})
	.transform((val) => {
		const [did, standard, chainId, router, account] = val.split(":");

		return {
			did,
			standard,
			chainId: Number(chainId),
			router,
			account,
		};
	});

export type DeconstructDidIdentifierReturnParams = {
	status: boolean;
	address: Address;
	resolver: Address;
	chainId: number;
};

export function deconstructDidIdentifier(
	id: string,
): DeconstructDidIdentifierReturnParams {
	try {
		const data = didSchema.parse(id);
		return {
			status: true,
			chainId: data.chainId as number,
			resolver: data.router as Address,
			address: data.account as Address,
		};
	} catch (e) {
		return {
			status: false,
			chainId: 0,
			resolver: zeroAddress,
			address: zeroAddress,
		};
	}
}
