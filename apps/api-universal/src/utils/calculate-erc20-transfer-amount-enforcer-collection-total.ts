import {
  decodeEnforcerERC20TransferAmount,
  getErc20TransferAmountEnforcerFromDelegation,
} from 'universal-delegations-sdk';
import type { Delegation } from 'universal-types';
import type { Address } from 'viem';

export function calculateERC20TransferAmountEnforcerCollectionTotal(
  delegations: Delegation[],
  token: Address,
): bigint {
  return delegations.reduce((acc, delegation) => {
    const { terms } = getErc20TransferAmountEnforcerFromDelegation(delegation);

    const [_token, _amount] = decodeEnforcerERC20TransferAmount(terms);
    if (String(_token).toLowerCase() !== token.toLowerCase() || !_amount) {
      return acc;
    }
    return acc + BigInt(_amount);
  }, BigInt(0));
}
