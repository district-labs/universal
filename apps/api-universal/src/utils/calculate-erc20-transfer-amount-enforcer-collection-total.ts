import type { DelegationDb } from 'api-delegations';
import { decodeEnforcerERC20TransferAmount } from 'universal-delegations-sdk';
import type { Address } from 'viem';

export function calculateERC20TransferAmountEnforcerCollectionTotal(
  delegations: DelegationDb[],
  token: Address,
): bigint {
  return delegations.reduce((acc, delegation) => {
    if (!delegation?.caveats?.[0]?.terms) {
      return acc;
    }
    const [_token, _amount] = decodeEnforcerERC20TransferAmount(
      delegation.caveats[0].terms,
    );
    if (String(_token).toLowerCase() !== token.toLowerCase() || !_amount) {
      return acc;
    }
    return acc + BigInt(_amount);
  }, BigInt(0));
}
