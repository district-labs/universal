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

export default function PersonalSignPage() {
  const [viewModeAdvanced, setViewModeAdvanced] = useState<boolean>(false);
  const { sendCalls, calls, isLoadingSendTx, isLoadingUserOp } = useSendCalls();

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
        <div className="px-6 mb-2">
          {viewModeAdvanced === false && (
            <div className="w-full flex flex-col gap-y-4">
              <Row label="Total Transactions" value={`${calls.length}`} />
              <Row
                label="Network Fee (est.)"
                value={<ActionTransactionFeeEstimate />}
              />
              <Row label="Network" value={<ActionTransactionNetwork />} />
            </div>
          )}
          {viewModeAdvanced === true && (
            <div className="w-full flex flex-col gap-y-4 max-w-full overflow-auto">
              {calls.map((call: any, index: number) => (
                <div key={index} className="bg-neutral-100 p-4 rounded-md">
                  <Row
                    label="Interacting With"
                    value={<Address truncate={true} address={call.to} />}
                  />
                </div>
              ))}
              <div className="bg-neutral-100 rounded-lg flex-1 p-4 text-xs w-fit">
                <pre className="break-words">
                  {JSON.stringify(calls, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
        <ActionTransactionPreview className="text-center flex-1" />
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
