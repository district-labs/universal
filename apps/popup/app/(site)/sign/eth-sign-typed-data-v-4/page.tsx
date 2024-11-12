'use client';
import { RowBasic } from '@/components/row-basic';
import { Toggle } from '@/components/toggle';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Delegation } from '@/lib/delegation-framework/types';
import { useGetMessageChainId } from '@/lib/pop-up/hooks/use-get-message-chain-id';
import { useMemo, useState } from 'react';
import type { UniversalDID } from 'universal-identity-sdk';
import type { TypedDataDefinition } from 'viem';
import { ActionRequestFooter } from '../components/action-request-footer';
import { ActionRequestHeader } from '../components/action-request-header';
import { ActionRequestMain } from '../components/action-request-main';
import { ActionRequestTitle } from '../components/action-request-title';
import { ActionRequestView } from '../components/action-request-view';
import { DelegationDefaultParsedView } from './components/delegation-default-parsed-view';
import { DIDAdvancedParsedView } from './components/did-advanced-parsed-view';
import { DIDDefaultParsedView } from './components/did-default-parsed-view';
import { GenerateEip712Items } from './components/generate-eip712-items';
import { useSignTypedDataV4 } from './hooks/use-sign-typed-data-v-4';

export default function EthSignTypedDataV4Page() {
  const [viewModeAdvanced, setViewModeAdvanced] = useState<boolean>(false);
  const chain = useGetMessageChainId();
  const { typedData, signTypedDataV4, isPending } = useSignTypedDataV4();

  const viewType = useMemo(() => {
    if (!typedData) {
      return 'eip712';
    }
    if (typedData.primaryType === 'UniversalDID') {
      return 'did';
    }
    if (typedData.primaryType === 'Delegation') {
      return 'delegation';
    }
    return 'eip712';
  }, [typedData]);

  if (!typedData || !viewType) {
    return (
      <div className="mt-0 flex w-full flex-col items-center justify-center px-10 py-4 lg:px-20">
        Invalid typed data
      </div>
    );
  }
  return (
    <ActionRequestView className="flex h-full w-full flex-1 flex-col">
      <ActionRequestHeader className="flex items-center justify-between border-b-2">
        <ActionRequestTitle type={viewType} className="font-medium text-sm">
          {viewType === 'eip712' && 'Signature'}
          {viewType === 'delegation' && 'Authorization'}
          {viewType === 'did' && 'Universal DID'}
        </ActionRequestTitle>
        <span className="flex items-center gap-x-1">
          <Toggle
            label="Advanced"
            handleIsTriggered={() => setViewModeAdvanced(!viewModeAdvanced)}
          />
        </span>
      </ActionRequestHeader>
      <ActionRequestMain className="w-full px-4 py-4">
        {viewModeAdvanced === false && (
          <DefaultRender
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
          className="w-full flex-1 rounded-full"
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

type DefaultRender = React.HTMLAttributes<HTMLElement> & {
  chainId: number;
  viewType: 'did' | 'delegation' | 'eip712';
  typedData: TypedDataDefinition;
};

const DefaultRender = ({ chainId, viewType, typedData }: DefaultRender) => {
  if (viewType === 'did') {
    return (
      <DIDDefaultParsedView
        chainId={chainId}
        typedData={typedData.message as UniversalDID}
      />
    );
  }

  if (viewType === 'delegation') {
    return (
      <DelegationDefaultParsedView
        chainId={chainId}
        typedData={typedData.message as Delegation}
      />
    );
  }

  return (
    <ScrollArea className="h-full max-h-[330px] flex-1 overflow-auto rounded-lg text-sm">
      <RowBasic label="Primary Type" value={typedData.primaryType} />
      <hr className="my-2 block border-neutral-200" />
      <GenerateEip712Items
        className="flex flex-col gap-y-3"
        data={typedData.message}
      />
    </ScrollArea>
  );
};

type AdvancedRender = React.HTMLAttributes<HTMLElement> & {
  chainId: number;
  viewType: 'did' | 'delegation' | 'eip712';
  typedData: TypedDataDefinition;
};

const AdvancedRender = ({ typedData, viewType, chainId }: AdvancedRender) => {
  if (viewType === 'did') {
    return (
      <DIDAdvancedParsedView
        className="w-full"
        chainId={chainId}
        typedData={typedData}
        data={typedData.message as UniversalDID}
      />
    );
  }

  return (
    <div className="h-full flex-1 overflow-auto rounded-lg bg-neutral-100 p-4 text-sm">
      <pre className="pb-4 font-mono text-xs">{`${JSON.stringify(typedData, null, 2)}`}</pre>
    </div>
  );
};
