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
import { useEstimateUserOpAssetChanges } from '@/lib/alchemy/hooks/use-simulate-user-op-asset-changes';
import { ActionTransactionNetworkSimplified } from '../components/action-transaction-network-simplified';

export default function PersonalSignPage() {
  const [viewModeAdvanced, setViewModeAdvanced] = useState<boolean>(false);
  const {
    data,
    isLoading: isLoadingEstimate,
    isError: isErrorEstimate,
  } = useEstimateUserOpAssetChanges();
  const {
    sendTransaction,
    txParams,
    isLoadingSendTx,
    isLoadingUserOp,
    isError,
  } = useSendTransaction();

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
                label="Blockchain"
                value={<ActionTransactionNetworkSimplified />}
              />
              <Row
                label="Application"
                value={<Address truncate={true} address={txParams.to} />}
              />
            </div>
            <ActionTransactionPreview className="text-center flex-1" />
          </>
        )}
        {viewModeAdvanced === true && (
          <div className="w-full flex flex-col gap-y-4 px-6">
            <Row
              label="Blockchain (Network)"
              value={<ActionTransactionNetwork />}
            />
            <Row
              label="Price (Fee est)"
              value={<ActionTransactionFeeEstimate />}
            />
            <Row
              label="Application (To)"
              value={<Address truncate={true} address={txParams.to} />}
            />
            <Row
              label="Wallet (From)"
              value={<Address truncate={true} address={txParams.from} />}
            />
            <Row
              label="ETH Amount (Value)"
              value={<EthAmountFormatted amount={txParams.value} />}
            />
            <hr className="border-neutral-300" />
            <div className="break-words text-xs max-h-[140px] bg-neutral-100 rounded-md p-4 shadow-inner overflow-auto">
              {txParams.data}
            </div>
          </div>
        )}
      </ActionRequestMain>
      <ActionRequestFooter>
        <Button
          className="flex-1 w-full rounded-full"
          size={'lg'}
          disabled={
            isLoadingEstimate ||
            isErrorEstimate ||
            !sendTransaction ||
            isLoadingUserOp ||
            isLoadingSendTx
          }
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
