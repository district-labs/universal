import { useCallback } from "react";
import type { Address } from "viem";
import { useChainId, usePublicClient } from "wagmi";
import { useQuery } from "wagmi/query";
import { resolveDid } from "../actions/resolve-did.js";

export function useUniversalResolver(inputs: {
	address?: Address;
	resolver?: Address;
} | null) {
	const chainId = useChainId();
	const client = usePublicClient();

	const query = useQuery({
		queryKey: ["did", inputs?.address, inputs?.resolver],
		queryFn: async () => {
			if (!client && !inputs?.address && !chainId) {
				return;
			}
			// @ts-expect-error We know that client is defined
			const data = await resolveDid(client, {
				resolver: inputs?.resolver,
				address: inputs?.address,
			});
			return data;
		},
		enabled: !!inputs?.address && !!inputs?.resolver && !!client,
	})

	const resolve = useCallback(
		async ({
			address,
			resolver,
		}: {
			address: Address;
			resolver: Address;
		}) => {
			if (!client || !address || !chainId) {
				return;
			}
			 const document = await resolveDid(client, {
				resolver: resolver,
				address: address,
			})
			document.data = JSON.parse(document.data);
			return document;
		},
		[client, chainId],
	);

	return {
		query,
		resolve,
	};
}
