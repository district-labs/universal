import type { Delegation } from 'universal-types';
import { getDelegationType } from './utils/get-delegation-type.js';
import { processLimitOrderDelegation } from './process-limit-order-delegation.js';

export async function processDelegation(delegation: Delegation) {
  const delegationType = getDelegationType(delegation);

  if (delegationType === 'LimitOrder') {
    return processLimitOrderDelegation(delegation);
  }
}
