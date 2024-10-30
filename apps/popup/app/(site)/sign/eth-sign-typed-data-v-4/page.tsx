'use client';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMemo, useState } from 'react';
import { isAddress, type TypedDataDefinition } from 'viem';
import { cn } from '@/lib/utils';
import { Address } from '@/components/onchain/address';
import { ActionRequestHeader } from '../components/action-request-header';
import { ActionRequestMain } from '../components/action-request-main';
import { ActionRequestFooter } from '../components/action-request-footer';
import { ActionRequestView } from '../components/action-request-view';
import { Toggle } from '@/components/toggle';
import { ActionRequestTitle } from '../components/action-request-title';
import { useSignTypedDataV4 } from './hooks/use-sign-typed-data-v-4';

function calculateTypedDataType(data: TypedDataDefinition) {
  if (data.primaryType === 'Delegation') {
    return 'delegation';
  }
  return 'standard';
}

export default function WalletSendCallsPage() {
  const [viewModeAdvanced, setViewModeAdvanced] = useState<boolean>(false);
  const { typedData, signTypedDataV4, isPending } = useSignTypedDataV4();

  if (!typedData) {
    return (
      <div className="mt-0 flex w-full flex-col justify-center items-center py-4 px-10 lg:px-20">
        Invalid typed data
      </div>
    );
  }
  return (
    <ActionRequestView className="flex flex-1 w-full flex-col h-full">
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
      <ActionRequestMain className="px-4 py-4">
        {viewModeAdvanced === false && (
          <OverviewRender
            viewType={calculateTypedDataType(typedData)}
            typedData={typedData}
          />
        )}
        {viewModeAdvanced === true && (
          <AdvancedRender
            viewType={calculateTypedDataType(typedData)}
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
          {isPending ? 'Signing...' : 'Sign'}
        </Button>
      </ActionRequestFooter>
    </ActionRequestView>
  );
}

type OverviewRender = React.HTMLAttributes<HTMLElement> & {
  viewType: 'delegation' | 'standard';
  typedData: TypedDataDefinition;
};

const OverviewRender = ({ viewType, typedData }: OverviewRender) => {
  if (viewType === 'delegation') {
    return <h3 className="font-normal text-lg">Coming Soon</h3>;
  }

  return (
    <ScrollArea className="max-h-[330px] h-full rounded-lg flex-1 text-sm overflow-auto">
      <Row label="Primary Type" value={typedData.primaryType} />
      <hr className="border-neutral-200 my-2 block" />
      <GenerateItems
        className="flex flex-col gap-y-3"
        data={typedData.message}
      />
    </ScrollArea>
  );
};

type AdvancedRender = React.HTMLAttributes<HTMLElement> & {
  viewType: 'delegation' | 'standard';
  typedData: TypedDataDefinition;
};

const AdvancedRender = ({ viewType, typedData }: OverviewRender) => {
  if (viewType === 'delegation') {
    return <h3 className="font-normal text-lg">Coming Soon</h3>;
  }

  return (
    <div className="max-h-[320px] h-full bg-neutral-100 rounded-lg flex-1 p-4 text-sm overflow-auto">
      <pre className="font-mono text-xs pb-4">{`${JSON.stringify(typedData, null, 2)}`}</pre>
    </div>
  );
};

type GenerateItems = React.HTMLAttributes<HTMLElement> & {
  data: TypedDataDefinition['message'];
};

const GenerateItems = ({ className, data }: GenerateItems) => {
  const [objKeys, objData] = useMemo(() => {
    const entries = Object.entries(data);

    // Define a ranking function for the value types
    const getTypeRank = (val: any) => {
      if (typeof val === 'string') return 1;
      if (typeof val === 'object') return 2;
      if (Array.isArray(val)) return 3;
      return 4; // For other types
    };

    // Sort the entries based on the defined ranking
    const sortedEntries = entries.sort((a, b) => {
      const rankA = getTypeRank(a[1]);
      const rankB = getTypeRank(b[1]);
      return rankA - rankB;
    });

    // Extract sorted keys and values
    const keys = sortedEntries.map(([key]) => key);
    const values = sortedEntries.map(([, value]) => value);

    return [keys, values];
  }, [data]);

  return (
    <div className={cn(className)}>
      {objData.map((item: any, index: number) => {
        return (
          <>
            {Array.isArray(item) && (
              <div className="rounded-lg">
                <h5 className="font-bold">{objKeys[index]}</h5>
                {item.map((val, i) => {
                  return (
                    <>
                      {typeof val === 'object' && <GenerateItems data={val} />}
                      {typeof val === 'string' && (
                        <span className="mr-2">{val}</span>
                      )}
                    </>
                  );
                })}
              </div>
            )}
            {!Array.isArray(item) && typeof item === 'object' && (
              <div className="bg-neutral-100 rounded-lg p-3">
                <span className="font-bold capitalize">{objKeys[index]}</span>
                <GenerateItems data={item} />
              </div>
            )}
            {typeof item == 'string' && (
              <Row key={index} label={objKeys[index]} value={item} />
            )}
          </>
        );
      })}
    </div>
  );
};

const Row = ({ value, label }: { value: any; label: string }) => {
  return (
    <div
      className={cn('flex justify-between', {
        'flex-col gap-y-2': value.length > 20 && !isAddress(value),
      })}
    >
      <span
        className={cn('text-sm capitalize', {
          'font-bold': value.length > 20 && !isAddress(value),
        })}
      >
        {label}
      </span>
      <span
        className={cn('text-sm font-bold', {
          'font-normal': value.length > 20 && !isAddress(value),
        })}
      >
        {isAddress(value) ? <Address truncate={true} address={value} /> : value}
      </span>
    </div>
  );
};
