import { base, baseSepolia } from "viem/chains";
import { basePublicClient, baseSepoliaPublicClient } from "./clients.js";
import type { PublicClient } from "viem";

export function getPublicClientFromList(chainId: number): PublicClient {
	switch (chainId) {
		case base.id:
			// @ts-expect-error basePublicClient is not a PublicClientType
			return basePublicClient;
		case baseSepolia.id:
			// @ts-expect-error baseSepoliaPublicClient is not a PublicClientType
			return baseSepoliaPublicClient;
		default:
			throw new Error("Invalid chain ID");
	}
}
