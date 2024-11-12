'use client';
import { Address } from '@/components/onchain/address';
import { EthAmountFormatted } from '@/components/onchain/eth-formatted';
import { Toggle } from '@/components/toggle';
import { Button } from '@/components/ui/button';
import { useEstimateUserOpAssetChanges } from '@/lib/alchemy/hooks/use-simulate-user-op-asset-changes';
import { type ReactElement, useState } from 'react';
import { ActionRequestFooter } from '../components/action-request-footer';
import { ActionRequestHeader } from '../components/action-request-header';
import { ActionRequestMain } from '../components/action-request-main';
import { ActionRequestTitle } from '../components/action-request-title';
import { ActionTransactionFeeEstimate } from '../components/action-transaction-fee-estimate';
import { ActionTransactionNetwork } from '../components/action-transaction-network';
import { ActionTransactionNetworkSimplified } from '../components/action-transaction-network-simplified';
import { ActionTransactionPreview } from '../components/action-transaction-preview';
import { useSendTransaction } from './hooks/use-send-transaction';

export default function SignEthSendTransactionPage() {
  const [viewModeAdvanced, setViewModeAdvanced] = useState<boolean>(false);
  const { isLoading: isLoadingEstimate, isError: isErrorEstimate } =
    useEstimateUserOpAssetChanges();
  const { sendTransaction, txParams, isLoadingSendTx, isLoadingUserOp } =
    useSendTransaction();

  if (!txParams) {
    return <div>Invalid Transaction</div>;
  }

  return (
    <div className="flex h-full w-full flex-1 flex-col justify-between">
      <ActionRequestHeader className="flex items-center justify-between border-b-2">
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
      <ActionRequestMain className="break-words px-0 pt-5">
        {viewModeAdvanced === false && (
          <>
            <div className="mb-0 flex w-full flex-col gap-y-4 px-6 pb-5">
              <Row
                label="Blockchain"
                value={<ActionTransactionNetworkSimplified />}
              />
              <Row
                label="Application"
                value={<Address truncate={true} address={txParams.to} />}
              />
            </div>
            <ActionTransactionPreview className="flex-1 text-center" />
          </>
        )}
        {viewModeAdvanced === true && (
          <div className="flex w-full flex-col gap-y-4 px-6">
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
            <div className="max-h-[140px] overflow-auto break-words rounded-md bg-neutral-100 p-4 text-xs shadow-inner">
              {txParams.data}
            </div>
          </div>
        )}
      </ActionRequestMain>
      <ActionRequestFooter>
        <Button
          className="w-full flex-1 rounded-full"
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
