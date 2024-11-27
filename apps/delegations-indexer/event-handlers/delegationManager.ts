import { ponder } from '@/generated';
import { universalDeployments } from 'universal-data';
import type { Address } from 'viem';
import { baseSepolia } from 'viem/chains';
import { type InsertCaveat, caveats, delegations } from '../../ponder.schema';
import { getDelegationHash } from '../utils/delegation/get-delegation-hash';

function getEnforcerType(enforcer: Address): string {
  if (
    enforcer.toLowerCase() ===
    universalDeployments[
      baseSepolia.id
    ]?.ERC20TransferAmountEnforcer?.toLowerCase()
  ) {
    return 'ERC20TransferAmountEnforcer';
  }
  return 'unknown';
}

function getDelegationType(caveats: InsertCaveat[]): string {
  if (
    caveats.some(
      (caveat) => caveat.enforcerType === 'ERC20TransferAmountEnforcer',
    )
  ) {
    return 'CreditLine';
  }
  return 'unknown';
}

ponder.on(
  'DelegationManager:RedeemedDelegation',
  async ({ event, context }) => {
    const { delegation, redeemer } = event.args;
    const delegationHash = getDelegationHash({
      chainId: context.network.chainId,
      ...delegation,
      caveats: delegation.caveats.slice(),
    });

    const formattedCaveats: InsertCaveat[] = delegation.caveats.map(
      (caveat) => ({
        ...caveat,
        enforcerType: getEnforcerType(caveat.enforcer),
        delegationHash,
      }),
    );

    // Insert delegation if not already present
    await context.db
      .insert(delegations)
      .values({
        hash: delegationHash,
        redeemer,
        chainId: context.network.chainId,
        delegationType: getDelegationType(formattedCaveats),
        ...delegation,
      })
      .onConflictDoNothing();

    // Insert caveats if not already present
    await context.db
      .insert(caveats)
      .values(formattedCaveats)
      .onConflictDoNothing();
  },
);
