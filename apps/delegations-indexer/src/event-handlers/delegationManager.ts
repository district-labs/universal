import { type Context, ponder } from '@/generated';
import { universalDeployments } from 'universal-data';
import type { Address } from 'viem';
import { type InsertCaveat, caveats, delegations } from '../../ponder.schema';
import { getDelegationHash } from '../utils/delegation/get-delegation-hash';
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

function getDelegationType(caveats: DelegationCaveatWithMetadata[]): string {
  if (
    caveats.some(
      (caveat) => caveat.enforcerType === 'ERC20TransferAmountEnforcer',
    )
  ) {
    return 'CreditLine';
  }
  return 'unknown';
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
    chainId: context.network.chainId,
    caveats: delegation.caveats.slice(),
  });

  const formattedCaveats: InsertCaveat[] = delegation.caveats.map(
    (caveat, index) => ({
      ...caveat,
      index,
      enforcerType: getEnforcerType(caveat.enforcer),
      delegationHash,
    }),
  );

  // Insert delegation if not already present
  await context.db
    .insert(delegations)
    .values({
      hash: delegationHash,
      enabled,
      chainId: context.network.chainId,
      delegationType: getDelegationType(formattedCaveats),
      ...delegation,
    })
    .onConflictDoUpdate({
      enabled,
      chainId: context.network.chainId,
      delegationType: getDelegationType(formattedCaveats),
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
