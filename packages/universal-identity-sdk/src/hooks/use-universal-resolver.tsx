import { useCallback } from "react";
import type { Address } from "viem";
import { useChainId, usePublicClient } from "wagmi";
import { useQuery } from "wagmi/query";
import {
	type ResolveUisReturnType,
	resolveDid,
} from "../actions/resolve-did.js";

export function useUniversalResolver(inputs?: {
	address?: Address;
	resolver?: Address;
}) {
	const chainId = useChainId();
	const client = usePublicClient();

	const query = useQuery<
		ResolveUisReturnType,
		Error,
		ResolveUisReturnType,
		["did", Address | undefined, Address | undefined]
	>({
		queryKey: ["did", inputs?.address, inputs?.resolver],
		queryFn: async (): Promise<ResolveUisReturnType> => {
			if (!client && !inputs?.address && !chainId) {
				throw new Error("Invalid parameters.");
			}
			// @ts-expect-error We know that client is defined
			const data = await resolveDid(client, {
				resolver: inputs?.resolver,
				address: inputs?.address,
			});
			return data;
		},
		enabled: !!inputs?.address && !!inputs?.resolver && !!client,
	});

	const resolve = useCallback(
		async ({
			address,
			resolver,
		}: {
			address: Address;
			resolver: Address;
		}): Promise<ResolveUisReturnType> => {
			if (!client || !address || !chainId) {
				throw new Error("Invalid parameters.");
			}

			const document = await resolveDid(client, {
				resolver: resolver,
				address: address,
			});
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
