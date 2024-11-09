'use client';
import { useWriteContract } from "wagmi"
import { delegationManagerAbi } from "../../abis/delegation-manager-abi.js"
import { encodeDelegations } from "../../delegation/encode-delegations.js"

import { SINGLE_EXECUTION_MODE } from "../../constants.js"
import type { Delegation, Execution } from "../../types.js"
import type { Address } from "viem"
import { encodeSingleExecution } from "../../execution/encode-single-execution.js"
import type { DelegationDb } from "delegations-api";

export function useDelegationExecute() {
    const { writeContract } = useWriteContract()

    return ({
        delegationManager,
        delegation,
        executions
    }:{
        delegationManager: Address,
        delegation: Delegation | DelegationDb,
        executions: Execution
    }) => {
        const permissionContext = [encodeDelegations([delegation])]
        const executionCallData = [encodeSingleExecution(executions)]
        writeContract({ 
            abi: delegationManagerAbi,
            address: delegationManager,
            functionName: "redeemDelegations",
            args: [permissionContext, SINGLE_EXECUTION_MODE, executionCallData],
        })
    }
}
