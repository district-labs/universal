import { type Context, ponder } from '@/generated';
import { universalDeployments } from 'universal-data';
import type { Address } from 'viem';
import { type InsertCaveat, caveats, delegations } from '../../ponder.schema';
import { getDelegationHash } from 'universal-delegations-sdk';
import type { Delegation, DelegationCaveatWithMetadata } from 'universal-types';

function getEnforcerType(enforcer: Address): string {
  if (
    enforcer.toLowerCase() ===
    universalDeployments.ERC20TransferAmountEnforcer?.toLowerCase()
  ) {
    return 'ERC20TransferAmountEnforcer';
  }
  return 'unknown';
}

function getDelegationType(
  caveats: DelegationCaveatWithMetadata[],
): string | null {
  if (
    caveats.some((caveat) => caveat?.type === 'ERC20TransferAmountEnforcer')
  ) {
    return 'CreditLine';
  }
  return null;
}

async function updateDelegation({
  context,
  enabled,
  delegation,
}: {
  context: Context;
  enabled: boolean;
  delegation: Omit<Delegation, 'chainId'>;
}) {
  const delegationHash = getDelegationHash({
    ...delegation,
    caveats: delegation.caveats.slice(),
  });

  const formattedCaveats = delegation.caveats.map((caveat, index) => ({
    ...caveat,
    index,
    type: getEnforcerType(caveat.enforcer),
    delegationHash,
  })) satisfies InsertCaveat[];

  // Insert delegation if not already present
  await context.db
    .insert(delegations)
    .values({
      hash: delegationHash,
      enabled,
      verifyingContract: universalDeployments.DelegationManager,
      chainId: context.network.chainId,
      type: getDelegationType(formattedCaveats),
      ...delegation,
    })
    .onConflictDoUpdate({
      enabled,
      chainId: context.network.chainId,
      type: getDelegationType(formattedCaveats),
      ...delegation,
    });

  if (formattedCaveats) {
    // Insert caveats if not already present
    await context.db
      .insert(caveats)
      .values(formattedCaveats)
      .onConflictDoNothing();
  }
}

ponder.on(
  'DelegationManager:RedeemedDelegation',
  async ({ event, context }) => {
    const { delegation } = event.args;
    await updateDelegation({
      context,
      enabled: true,
      delegation: {
        ...delegation,
        caveats: delegation.caveats.slice(),
      },
    });
  },
);

ponder.on(
  'DelegationManager:DisabledDelegation',
  async ({ event, context }) => {
    const { delegation } = event.args;
    await updateDelegation({
      context,
      enabled: false,
      delegation: {
        ...delegation,
        caveats: delegation.caveats.slice(),
      },
    });
  },
);

ponder.on('DelegationManager:EnabledDelegation', async ({ event, context }) => {
  const { delegation } = event.args;
  await updateDelegation({
    context,
    enabled: true,
    delegation: {
      ...delegation,
      caveats: delegation.caveats.slice(),
    },
  });
});
