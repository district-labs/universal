'use client';
import { Button } from '@/components/ui/button';

import { useState } from 'react';
import { ActionRequestView } from '../components/action-request-view';
import { ActionRequestFooter } from '../components/action-request-footer';
import { ActionRequestHeader } from '../components/action-request-header';
import { ActionRequestMain } from '../components/action-request-main';
import { ActionRequestTitle } from '../components/action-request-title';
import { Toggle } from '@/components/toggle';
import { Address } from '@/components/onchain/address';
import { ActionTransactionPreview } from '../components/action-transaction-preview';
import { ActionTransactionNetwork } from '../components/action-transaction-network';
import { ActionTransactionFeeEstimate } from '../components/action-transaction-fee-estimate';
import { useSendCalls } from './hooks/use-send-calls';
import { ActionTransactionNetworkSimplified } from '../components/action-transaction-network-simplified';
import { EthAmountFormatted } from '@/components/onchain/eth-formatted';
import { type Address as AddressType } from 'viem';

export default function PersonalSignPage() {
  const [viewModeAdvanced, setViewModeAdvanced] = useState<boolean>(false);
  const { sendCalls, calls, isLoadingSendTx, isLoadingUserOp, from } =
    useSendCalls();

  if (!calls) {
    return <div>Invalid Transactions</div>;
  }

  return (
    <ActionRequestView>
      <ActionRequestHeader className="flex justify-between items-center border-b-2">
        <ActionRequestTitle type="transaction">
          Batch Transaction Request
        </ActionRequestTitle>
        <span className="flex items-center gap-x-1">
          <Toggle
            label="Advanced"
            handleIsTriggered={() => setViewModeAdvanced(!viewModeAdvanced)}
          />
        </span>
      </ActionRequestHeader>
      <ActionRequestMain className="pt-6 px-0">
        {viewModeAdvanced === false && (
          <>
            <div className="w-full flex flex-col gap-y-4 px-6 mb-0 pb-5">
              <Row
                label="Network"
                value={<ActionTransactionNetworkSimplified />}
              />
            </div>
            <ActionTransactionPreview className="text-center flex-1" />
          </>
        )}
        {viewModeAdvanced === true && (
          <div className="w-full flex flex-col gap-y-4 max-w-full px-4 overflow-auto">
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
            {calls.map((call: any, index: number) => (
              <div key={index} className="bg-neutral-100 p-4 rounded-md">
                <Row
                  label="Interacting With"
                  value={<Address truncate={true} address={call.to} />}
                />
              </div>
            ))}
            <div className="bg-neutral-100 rounded-lg flex-1 p-4 text-xs w-auto overflow-auto mb-4">
              <pre className="font-mono text-xs pb-4">{`${JSON.stringify(calls, null, 2)}`}</pre>
            </div>
          </div>
        )}
      </ActionRequestMain>
      <ActionRequestFooter>
        <Button
          className="flex-1 w-full rounded-full"
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

const Row = ({ value, label }: { value: any; label: string }) => {
  return (
    <div className="flex justify-between">
      <span className="text-sm">{label}</span>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );
};
