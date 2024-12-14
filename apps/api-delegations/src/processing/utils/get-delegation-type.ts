import type { Delegation } from 'universal-types';
import { universalDeployments } from 'universal-data';

// TODO: Extract type/function and make it globally available
export type DelegationType = 'LimitOrder';

export function getDelegationType(
  delegation: Delegation,
): DelegationType | null {
  // TODO: Add more robust logic to determine delegation type
  if (
    delegation.caveats.some(
      ({ enforcer }) =>
        enforcer.toLowerCase() ===
        universalDeployments.ExternalCallEnforcer.toLowerCase(),
    )
  ) {
    return 'LimitOrder';
  }
  return null;
}
