'use client';
import { Address } from '@/components/onchain/address';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { EthAmountFormatted } from '@/components/onchain/eth-formatted';
import { ActionRequestHeader } from '../components/action-request-header';
import { ActionRequestMain } from '../components/action-request-main';
import { ActionRequestFooter } from '../components/action-request-footer';
import { ActionRequestTitle } from '../components/action-request-title';
import { Toggle } from '@/components/toggle';
import { ActionTransactionPreview } from '../components/action-transaction-preview';
import { ActionTransactionFeeEstimate } from '../components/action-transaction-fee-estimate';
import { ActionTransactionNetwork } from '../components/action-transaction-network';
import { useSendTransaction } from './hooks/use-send-transaction';

export default function PersonalSignPage() {
  const [viewModeAdvanced, setViewModeAdvanced] = useState<boolean>(false);
  const { sendTransaction, txParams, isLoadingSendTx, isLoadingUserOp } =
    useSendTransaction();

  if (!txParams) {
    return <div>Invalid Transaction</div>;
  }

  return (
    <div className="flex flex-1 w-full flex-col justify-between h-full">
      <ActionRequestHeader className="flex justify-between items-center border-b-2">
        <ActionRequestTitle type="transaction">
          Transaction Request
        </ActionRequestTitle>
        <span className="flex items-center gap-x-1">
          <Toggle
            label="Advanced"
            handleIsTriggered={() => setViewModeAdvanced(!viewModeAdvanced)}
          />
        </span>
      </ActionRequestHeader>
      <ActionRequestMain className="break-words pt-5 px-0">
        {viewModeAdvanced === false && (
          <>
            <div className="w-full flex flex-col gap-y-4 px-6 mb-0 pb-5">
              <Row
                label="Application"
                value={<Address truncate={true} address={txParams.to} />}
              />
              <Row
                label="Network Fee (est.)"
                value={<ActionTransactionFeeEstimate />}
              />
              <Row label="Network" value={<ActionTransactionNetwork />} />
            </div>
            <ActionTransactionPreview className="text-center flex-1" />
          </>
        )}
        {viewModeAdvanced === true && (
          <div className="w-full flex flex-col gap-y-4 px-6">
            <Row
              label="From"
              value={<Address truncate={true} address={txParams.from} />}
            />
            <Row
              label="To"
              value={<Address truncate={true} address={txParams.to} />}
            />
            <Row
              label="Value"
              value={<EthAmountFormatted amount={txParams.value} />}
            />
            <hr className="border-neutral-300" />
            <div className="break-words text-sm">
              {txParams.value && txParams.data}
            </div>
          </div>
        )}
      </ActionRequestMain>
      <ActionRequestFooter>
        <Button
          className="flex-1 w-full rounded-full"
          size={'lg'}
          disabled={!sendTransaction || isLoadingUserOp || isLoadingSendTx}
          onClick={() => sendTransaction?.()}
        >
          {isLoadingUserOp
            ? 'Broadcasting...'
            : isLoadingSendTx
              ? 'Signing...'
              : 'Confirm'}
        </Button>
      </ActionRequestFooter>
    </div>
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
