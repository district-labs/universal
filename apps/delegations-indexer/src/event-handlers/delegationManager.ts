import { ponder, type Context } from '@/generated';
import { universalDeployments } from 'universal-data';
import type { Address, Hex } from 'viem';
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

async function updateDelegation({
  context,
  enabled,
  delegation,
}: {
  context: Context;
  enabled: boolean;
  delegation: {
    delegate: Address;
    delegator: Address;
    authority: Hex;
    caveats: readonly {
      enforcer: Address;
      terms: Hex;
      args: Hex;
    }[];
    salt: bigint;
    signature: Hex;
  };
}) {
  const delegationHash = getDelegationHash({
    chainId: context.network.chainId,
    ...delegation,
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

  // Insert caveats if not already present
  await context.db
    .insert(caveats)
    .values(formattedCaveats)
    .onConflictDoNothing();
}

ponder.on(
  'DelegationManager:RedeemedDelegation',
  async ({ event, context }) => {
    const { delegation } = event.args;
    await updateDelegation({ context, enabled: true, delegation });
  },
);

ponder.on(
  'DelegationManager:DisabledDelegation',
  async ({ event, context }) => {
    const { delegation } = event.args;
    await updateDelegation({ context, enabled: false, delegation });
  },
);

ponder.on('DelegationManager:EnabledDelegation', async ({ event, context }) => {
  const { delegation } = event.args;
  await updateDelegation({ context, enabled: true, delegation });
});
