import { universalDeployments, universalResolverAbi } from "universal-data";
import { type PostDid } from "./validation/did.js";
import { getPublicClientFromList } from "./viem/index.js";
import { zeroAddress } from "viem";

export function getIdentifier(did: PostDid) {
	const publicClient = getPublicClientFromList(did.chainId);
	if (!universalDeployments?.[did.chainId]?.resolver)
		throw new Error("Invalid chainId");
	return publicClient.readContract({
		address: universalDeployments?.[did.chainId]?.resolver || zeroAddress,
		abi: universalResolverAbi,
		functionName: "getIdentifierAddress",
		args: [did.address],
	});
}
