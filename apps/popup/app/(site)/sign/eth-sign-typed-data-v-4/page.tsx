'use client';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMemo, useState } from 'react';
import { type TypedDataDefinition } from 'viem';
import { ActionRequestHeader } from '../components/action-request-header';
import { ActionRequestMain } from '../components/action-request-main';
import { ActionRequestFooter } from '../components/action-request-footer';
import { ActionRequestView } from '../components/action-request-view';
import { Toggle } from '@/components/toggle';
import { ActionRequestTitle } from '../components/action-request-title';
import { useSignTypedDataV4 } from './hooks/use-sign-typed-data-v-4';
import { DelegationParsedView } from './components/delegation-parsed-view';
import { Delegation } from '@/lib/delegation-framework/types';
import { useGetMessageChainId } from '@/lib/pop-up/hooks/use-get-message-chain-id';
import { GenerateEip712Items } from './components/generate-eip712-items';
import { RowBasic } from '@/components/row-basic';

function calculateTypedDataType(data: TypedDataDefinition) {
  if (data.primaryType === 'Delegation') {
    return 'delegation';
  }
  return 'standard';
}

export default function WalletSendCallsPage() {
  const [viewModeAdvanced, setViewModeAdvanced] = useState<boolean>(false);
  const chain = useGetMessageChainId();
  const { typedData, signTypedDataV4, isPending } = useSignTypedDataV4();

  const viewType = useMemo(() => {
    if (!typedData) return 'standard';
    return calculateTypedDataType(typedData);
  }, [typedData]);

  if (!typedData || !viewType) {
    return (
      <div className="mt-0 flex w-full flex-col justify-center items-center py-4 px-10 lg:px-20">
        Invalid typed data
      </div>
    );
  }
  return (
    <ActionRequestView className="flex flex-1 w-full flex-col h-full">
      {viewType === 'standard' && (
        <ActionRequestHeader className="flex justify-between items-center border-b-2">
          <ActionRequestTitle type="eip712" className="text-sm font-medium">
            Authorization Request
          </ActionRequestTitle>
          <span className="flex items-center gap-x-1">
            <Toggle
              label="Advanced"
              handleIsTriggered={() => setViewModeAdvanced(!viewModeAdvanced)}
            />
          </span>
        </ActionRequestHeader>
      )}
      {viewType === 'delegation' && (
        <ActionRequestHeader className="flex justify-between items-center border-b-2">
          <ActionRequestTitle type="eip712" className="text-sm font-medium">
            Debit Authorization
          </ActionRequestTitle>
          <span className="flex items-center gap-x-1">
            <Toggle
              label="Advanced"
              handleIsTriggered={() => setViewModeAdvanced(!viewModeAdvanced)}
            />
          </span>
        </ActionRequestHeader>
      )}
      <ActionRequestMain className="px-4 py-4">
        {viewModeAdvanced === false && (
          <OverviewRender
            chainId={chain?.id || 1}
            viewType={viewType}
            typedData={typedData}
          />
        )}
        {viewModeAdvanced === true && (
          <AdvancedRender
            chainId={chain?.id || 1}
            viewType={viewType}
            typedData={typedData}
          />
        )}
      </ActionRequestMain>
      <ActionRequestFooter>
        <Button
          className="flex-1 w-full rounded-full"
          size={'lg'}
          disabled={!signTypedDataV4 || isPending}
          onClick={() => signTypedDataV4?.()}
        >
          {isPending ? 'Signing...' : 'Confirm'}
        </Button>
      </ActionRequestFooter>
    </ActionRequestView>
  );
}

type OverviewRender = React.HTMLAttributes<HTMLElement> & {
  chainId: number;
  viewType: 'delegation' | 'standard';
  typedData: TypedDataDefinition;
};

const OverviewRender = ({ chainId, viewType, typedData }: OverviewRender) => {
  if (viewType === 'delegation') {
    return (
      <DelegationParsedView
        chainId={chainId}
        typedData={typedData.message as Delegation}
      />
    );
  }

  return (
    <ScrollArea className="max-h-[330px] h-full rounded-lg flex-1 text-sm overflow-auto">
      <RowBasic label="Primary Type" value={typedData.primaryType} />
      <hr className="border-neutral-200 my-2 block" />
      <GenerateEip712Items
        className="flex flex-col gap-y-3"
        data={typedData.message}
      />
    </ScrollArea>
  );
};

type AdvancedRender = React.HTMLAttributes<HTMLElement> & {
  typedData: TypedDataDefinition;
};

const AdvancedRender = ({ typedData }: OverviewRender) => {
  return (
    <div className="max-h-[320px] h-full bg-neutral-100 rounded-lg flex-1 p-4 text-sm overflow-auto">
      <pre className="font-mono text-xs pb-4">{`${JSON.stringify(typedData, null, 2)}`}</pre>
    </div>
  );
};
