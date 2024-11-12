'use client';
import type { Address } from "viem"
import { useReadContract } from "wagmi"
import type { Delegation } from "../../types.js"
import { delegationManagerAbi } from "../../abis/delegation-manager-abi.js"
import { getDelegationHash } from "../../delegation/get-delegation-hash.js";
import type { DelegationDb } from "api-delegations";

export function useDelegationStatus({
    delegationManager,
    delegation
}:{
    delegationManager: Address,
    delegation: Delegation | DelegationDb,
}) {
    const hash = getDelegationHash(delegation)
    return useReadContract({ 
        abi: delegationManagerAbi,
        address: delegationManager,
        functionName: "disabledDelegations",
        args: [hash],
        query: {
            enabled: !!delegationManager && !!hash,
            refetchInterval: 3000,
          },
    })
}
