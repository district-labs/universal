'use client';
import { Button } from '@/components/ui/button';

import { CreditDelegationsSheet } from '@/components/credit-delegations-sheet';
import { Address } from '@/components/onchain/address';
import { EthAmountFormatted } from '@/components/onchain/eth-formatted';
import { Toggle } from '@/components/toggle';
import { type ReactElement, useState } from 'react';
import type { DelegationDb } from 'universal-delegations-sdk';
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

export type DelegationExecutions = {
  delegation: DelegationDb;
  execution: {
    hash: string;
    amount: bigint;
    amountFormatted: string;
  };
  token: {
    name: string;
    symbol: string;
    decimals: number;
  };
};

export default function PersonalSignPage() {
  const [viewModeAdvanced, setViewModeAdvanced] = useState<boolean>(false);
  const [delegationExecutions, setDelegationExecutions] =
    useState<DelegationExecutions[]>();
  const { sendCalls, calls, isLoadingSendTx, isLoadingUserOp, from, sender } =
    useSendCalls({
      redemptions: delegationExecutions?.map(({ execution, delegation }) => ({
        amount: execution.amount,
        delegation,
      })),
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
            <div className="space-y-2 border-t-2 bg-neutral-100/60 px-6 py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Credit Lines</span>
                {sender && (
                  <CreditDelegationsSheet
                    address={sender}
                    onSelect={setDelegationExecutions}
                  >
                    <span className="cursor-pointer font-bold text-sm">
                      Manage
                    </span>
                  </CreditDelegationsSheet>
                )}
              </div>
              {delegationExecutions?.map((delegation) => (
                <div
                  key={delegation.execution.hash}
                  className="flex justify-between"
                >
                  <span className="text-sm">{delegation?.token?.symbol}</span>
                  <span className="font-bold text-sm">
                    {delegation?.execution?.amountFormatted}
                  </span>
                </div>
              ))}
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
