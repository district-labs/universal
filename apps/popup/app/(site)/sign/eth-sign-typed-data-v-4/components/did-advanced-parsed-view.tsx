import { RowAdvanced } from '@/components/row-advanced';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import {
  type DidDocument,
  type UniversalDID,
  deconstructDidIdentifier,
} from 'universal-identity-sdk';
import type { Chain, TypedDataDefinition } from 'viem';

export type DIDAdvancedParsedView = React.HTMLAttributes<HTMLElement> & {
  chainId: Chain['id'];
  typedData: TypedDataDefinition;
  data: UniversalDID;
};

export const DIDAdvancedParsedView = ({
  className,
  typedData,
  data,
  chainId,
}: DIDAdvancedParsedView) => {
  const document = useMemo(() => {
    // TODO: use didDocumentSchema from universal-identity-sdk. breaks popup for unknown reason.
    const parsed = JSON.parse(data.document);
    const deconstructed = deconstructDidIdentifier(parsed.id);
    return {
      status: true,
      data: parsed as DidDocument,
      deconstructed: deconstructed,
    };
  }, [data]);

  if (!document.status) {
    return <div className={cn(className)}>Error Generating Identity</div>;
  }

  return (
    <div className={cn(className)}>
      <div className="mt-4 space-y-2">
        <RowAdvanced label="Name" value={'Universal Resolver'} />
        <RowAdvanced label="Version" value={'1'} />
        <RowAdvanced label="Chain ID" value={chainId.toString()} />
        <RowAdvanced
          label="Verifying Contract"
          value={document.deconstructed.resolver}
          direction="column"
        />
      </div>
      <hr className="my-4 border-neutral-200" />
      <h3 className="font-bold text-sm">Document</h3>
      <div className="mb-6 h-full flex-1 overflow-auto break-words rounded-lg bg-neutral-100 p-4 text-sm">
        <pre className="break-words pb-4 font-mono text-xs">{`${JSON.stringify(document.data, null, 2)}`}</pre>
      </div>
      <h3 className="font-bold text-sm">Full Message</h3>
      <div className="h-full flex-1 overflow-auto rounded-lg bg-neutral-100 p-4 text-sm">
        <pre className="pb-4 font-mono text-xs">{`${JSON.stringify(typedData, null, 2)}`}</pre>
      </div>
    </div>
  );
};
