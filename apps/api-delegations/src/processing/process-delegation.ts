import type { Delegation } from 'universal-types';
import { getDelegationType } from './utils/get-delegation-type.js';
import { processLimitOrderDelegation } from './limit-order/index.js';
import type { ValidChain } from 'universal-data';

export async function processDelegation({
  chainId,
  delegation,
}: { chainId: ValidChain['id']; delegation: Delegation }) {
  const delegationType = getDelegationType(delegation);

  if (delegationType === 'LimitOrder') {
    await processLimitOrderDelegation({ chainId, delegation });
  }
}
