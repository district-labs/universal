import type { Address, Hex } from 'viem';

import type { DelegationDb } from 'delegations-api';

export function transformDelegationDbToDelegationTypes(delegation: DelegationDb) {
    return {
        chainId: delegation.chainId,
        verifyingContract: delegation.verifyingContract as Address,
        delegator: delegation.delegator as Address,
        delegate: delegation.delegate as Address,
        authority: delegation.authority as Hex,
        salt: BigInt(delegation.salt),
        signature: delegation.signature as Hex,
        caveats: delegation.caveats.map((caveat) => {
            return {
            enforcerType: caveat.enforcerType,
            enforcer: caveat.enforcer as Address,
            terms: caveat.terms as Hex,
            args: caveat.args as Hex,
        }})
    }
}
