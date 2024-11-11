'use client';
import type { Address } from "viem"
import { useWriteContract } from "wagmi"
import { delegationManagerAbi } from "../../abis/delegation-manager-abi.js"
import type { Delegation } from "../../types.js"
import type { DelegationDb } from "api-delegations";

export function useEnableDelegation({
    delegationManager,
    delegation
}:{
    delegationManager: Address,
    delegation: Delegation | DelegationDb,
}) {
    const { writeContract, ...rest } = useWriteContract()

    const enable = () => {
        if(!delegationManager || !delegation) return
        writeContract({ 
            abi: delegationManagerAbi,
            address: delegationManager,
            functionName: "enableDelegation",
            args: [delegation as Delegation],
        })
    }

    return { enable, ...rest }
}
