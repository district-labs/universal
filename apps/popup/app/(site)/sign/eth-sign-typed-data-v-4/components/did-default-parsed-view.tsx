import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import {
  type DidDocument,
  type UniversalDID,
  deconstructDidIdentifier,
} from 'universal-identity-sdk';
import { DIDCard } from 'universal-wallet-ui';
import type { Chain } from 'viem';

export type DIDDefaultParsedView = React.HTMLAttributes<HTMLElement> & {
  chainId: Chain['id'];
  typedData: UniversalDID;
};

export const DIDDefaultParsedView = ({
  className,
  typedData,
  chainId,
}: DIDDefaultParsedView) => {
  const document = useMemo(() => {
    // TODO: use didDocumentSchema from universal-identity-sdk. breaks popup for unknown reason.
    const parsed = JSON.parse(typedData.document);
    const deconstructed = deconstructDidIdentifier(parsed.id);
    return {
      status: true,
      data: parsed as DidDocument,
      deconstructed: deconstructed,
    };
  }, [typedData]);

  if (!document.status) {
    return <div className={cn(className)}>Error Generating Identity</div>;
  }

  return (
    <div className={cn('flex justify-center', className)}>
      <DIDCard
        chainId={chainId}
        account={document.deconstructed.address}
        resolver={document.deconstructed.resolver}
      />
    </div>
  );
};
