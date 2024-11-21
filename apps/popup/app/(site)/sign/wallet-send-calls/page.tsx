'use client';
import { Button } from '@/components/ui/button';

import { Address } from '@/components/onchain/address';
import { EthAmountFormatted } from '@/components/onchain/eth-formatted';
import { Toggle } from '@/components/toggle';
import { type ReactElement, useState } from 'react';
import { parseUnits, type Address as AddressType, type Hex } from 'viem';
import { ActionRequestFooter } from '../components/action-request-footer';
import { ActionRequestHeader } from '../components/action-request-header';
import { ActionRequestMain } from '../components/action-request-main';
import { ActionRequestTitle } from '../components/action-request-title';
import { ActionRequestView } from '../components/action-request-view';
import { ActionTransactionFeeEstimate } from '../components/action-transaction-fee-estimate';
import { ActionTransactionNetwork } from '../components/action-transaction-network';
import { ActionTransactionNetworkSimplified } from '../components/action-transaction-network-simplified';
import { ActionTransactionPreview } from '../components/action-transaction-preview';
import { useSendCalls } from './hooks/use-send-calls';
import type {
  DelegationWithHash,
  Erc20TransferEnforcerRedemption,
} from '@/lib/delegation-framework/enforcers/erc20-transfer-amount/format-erc20-transfer-enforcer-calls';

const delegation: {
  hash: Hex;
  delegations: DelegationWithHash[];
} = {
  hash: '0x5ab36efb34c398b7dc50ec49e305a34c811b7f35981e05b06fe060459c1904f1',
  delegations: [
    {
      hash: '0x5ab36efb34c398b7dc50ec49e305a34c811b7f35981e05b06fe060459c1904f1',
      delegator: '0x2Fd35abcfE9d92A174a726dfaFd417f85f652544',
      delegate: '0x8d6F2Bb756f3f42820b72d51c2B8D1650253d14f',
      salt: 0n,
      authority:
        '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
      signature:
        '0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000000170000000000000000000000000000000000000000000000000000000000000001584c8741d07f40e87460899e93a7f983b559f1efc86e340ade361546037bd38d192e121c4e109bb9cb7e98da77008eff76d5d0520018c258d01cce7fc3929aa0000000000000000000000000000000000000000000000000000000000000002549960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97631d0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000867b2274797065223a22776562617574686e2e676574222c226368616c6c656e6765223a226733456a376d4359536d48777148585a54504d2d36694d424d3458353846376f66524364656f4e51625f4d222c226f726967696e223a22687474703a2f2f6c6f63616c686f73743a33303030222c2263726f73734f726967696e223a66616c73657d0000000000000000000000000000000000000000000000000000',
      caveats: [
        {
          args: '0x',
          enforcer: '0xF2887a650f688a12758f660AE9b0cb4306BF536D',
          terms:
            '0xe3cfc3bb7c8149d76829426d0544e6a76be5a00b00000000000000000000000000000000000000000000001b1ae4d6e2ef500000',
        },
      ],
    },
  ],
};

const redemptions: Erc20TransferEnforcerRedemption[] = [
  {
    amount: parseUnits('10', 18),
    delegationHash: delegation.hash,
  },
];
const delegations = delegation.delegations;

export default function PersonalSignPage() {
  const [viewModeAdvanced, setViewModeAdvanced] = useState<boolean>(false);
  const { sendCalls, calls, isLoadingSendTx, isLoadingUserOp, from } =
    useSendCalls({
      delegations,
      redemptions,
    });

  if (!calls) {
    return <div>Invalid Transactions</div>;
  }

  return (
    <ActionRequestView>
      <ActionRequestHeader className="flex items-center justify-between border-b-2">
        <ActionRequestTitle type="transaction">
          Batch Transaction Request
        </ActionRequestTitle>
        <span className="flex items-center gap-x-1">
          <Toggle
            label="Details"
            handleIsTriggered={() => setViewModeAdvanced(!viewModeAdvanced)}
          />
        </span>
      </ActionRequestHeader>
      <ActionRequestMain className="px-0 pt-6">
        {viewModeAdvanced === false && (
          <>
            <div className="mb-0 flex w-full flex-col gap-y-4 px-6 pb-5">
              <Row
                label="Network"
                value={<ActionTransactionNetworkSimplified />}
              />
            </div>
            <ActionTransactionPreview className="flex-1 text-center" />
          </>
        )}
        {viewModeAdvanced === true && (
          <div className="flex w-full max-w-full flex-col gap-y-4 overflow-auto px-4">
            <Row label="Total Transactions" value={`${calls.length}`} />
            <Row label="Network" value={<ActionTransactionNetwork />} />
            <Row
              label="Price (Fee est)"
              value={<ActionTransactionFeeEstimate />}
            />
            <Row
              label="Wallet (From)"
              value={<Address truncate={true} address={from as AddressType} />}
            />
            <Row
              label="ETH Amount (Value)"
              value={<EthAmountFormatted amount={calls.value} />}
            />
            <hr className="border-neutral-200" />
            {calls.map(
              (call: {
                to: AddressType;
                value: string;
              }) => (
                <div key={call.to} className="rounded-md bg-neutral-100 p-4">
                  <Row
                    label="Interacting With"
                    value={<Address truncate={true} address={call.to} />}
                  />
                </div>
              ),
            )}
            <div className="mb-4 w-auto flex-1 overflow-auto rounded-lg bg-neutral-100 p-4 text-xs">
              <pre className="pb-4 font-mono text-xs">{`${JSON.stringify(calls, null, 2)}`}</pre>
            </div>
          </div>
        )}
      </ActionRequestMain>
      <ActionRequestFooter>
        <Button
          className="w-full flex-1 rounded-full"
          size={'lg'}
          disabled={!sendCalls || isLoadingUserOp || isLoadingSendTx}
          onClick={() => sendCalls?.()}
        >
          {isLoadingUserOp
            ? 'Broadcasting...'
            : isLoadingSendTx
              ? 'Signing...'
              : 'Confirm'}
        </Button>
      </ActionRequestFooter>
    </ActionRequestView>
  );
}

const Row = ({
  value,
  label,
}: { value: ReactElement | string; label: string }) => {
  return (
    <div className="flex justify-between">
      <span className="text-sm">{label}</span>
      <span className="font-bold text-sm">{value}</span>
    </div>
  );
};
