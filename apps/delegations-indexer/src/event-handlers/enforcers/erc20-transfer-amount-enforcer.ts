import { ponder } from '@/generated';
import { enforcerEvents } from '../../../ponder.schema';
import { encodeErc20TransferAmountEvent } from '../../utils/delegation/enforcers/erc20-transfer-amount-enforcer';

ponder.on(
  'ERC20TransferAmountEnforcer:IncreasedSpentMap',
  async ({ event, context }) => {
    const { delegationHash, redeemer } = event.args;
    const encodedEventArgs = encodeErc20TransferAmountEvent(event.args);

    // Insert enforcer event
    await context.db.insert(enforcerEvents).values({
      delegationHash,
      timestamp: event.block.timestamp,
      blockNumber: event.block.number,
      transactionHash: event.transaction.hash,
      args: encodedEventArgs,
      enforcer: event.log.address,
      redeemer,
      enforcerType: 'ERC20TransferAmountEnforcer',
      event: 'IncreasedSpentMap',
    });
  },
);
