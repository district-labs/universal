import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { formatNumber } from '@/lib/utils';
import type * as React from 'react';
import { useState } from 'react';
import type { DelegationWithMetadata, SocialCredential } from 'universal-data';
import { DebitCard } from 'universal-wallet-ui';
import { AccountSocialCredentialBadge } from './identity/account-social-credential-badge';
import { Address } from './onchain/address';
import { RowBasic } from './row-basic';
import { Button } from './ui/button';
import { Card } from './ui/card';

type DelegationDetailsSheet = React.HTMLAttributes<HTMLElement> & {
  credentials: SocialCredential[];
  delegation: DelegationWithMetadata;
};

export const DelegationDetailsSheet = ({
  children,
  credentials,
  delegation,
}: DelegationDetailsSheet) => {
  const [isOpen, toggleIsOpen] = useState(false);
  return (
    <Sheet open={isOpen}>
      <SheetTrigger asChild={true} onClick={() => toggleIsOpen(true)}>
        {children}
      </SheetTrigger>
      <SheetContent
        side={'bottom'}
        className="top-0 overflow-auto pb-20"
        isCloseDisabled={true}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Authorization Details</SheetTitle>
          <SheetDescription>
            Overview of the authorization details for this delegation.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-3">
          <Card className="space-y-2 px-4 pt-4">
            <h3 className="font-bold text-base">Account Information</h3>
            <Address
              className="inline-block"
              truncate={true}
              truncateLength={14}
              address={delegation.data.delegate}
            />
            <div className="overflow-auto whitespace-nowrap pb-5">
              <div className="flex items-center gap-x-3">
                <AccountSocialCredentialBadge
                  address={delegation.data.delegator}
                  credentials={credentials}
                />
              </div>
            </div>
          </Card>
          <DebitCard
            to={delegation.data.delegate}
            tokenAddress={delegation.metadata.token.address}
            amount={delegation.metadata.available.amountFormatted}
            symbol={delegation.metadata.token.symbol}
            name={delegation.metadata.token.name}
          />
          <Card className="space-y-1 p-4">
            <h3 className="font-bold text-lg">Authorization Details</h3>
            <RowBasic label="From" value={delegation.data.delegator} />
            <RowBasic
              label="Asset"
              value={`${delegation.metadata.token.symbol} (${delegation.metadata.token.name})`}
            />
            <RowBasic
              label="Asset Address"
              value={`${delegation.metadata.token.address}`}
            />
            <RowBasic
              label="Total"
              value={formatNumber(delegation.metadata.limit.amountFormatted)}
            />
            <RowBasic
              label="Available"
              value={formatNumber(
                delegation.metadata.available.amountFormatted,
              )}
            />
            <RowBasic
              label="Spent"
              value={formatNumber(delegation.metadata.spent.amountFormatted)}
            />
          </Card>
          <Card className="space-y-1 p-4">
            <h3 className="font-bold text-lg">Technical Details</h3>
            {delegation.data.caveats.map((caveat) => {
              return (
                <RowBasic
                  key={caveat.id}
                  label={caveat.enforcerType}
                  value={caveat.enforcer}
                />
              );
            })}
          </Card>
        </div>
        <div className="fixed right-0 bottom-0 left-0 flex gap-x-4 border-t-2 bg-white px-4 py-3">
          <Button
            onClick={() => {
              toggleIsOpen(false);
            }}
            variant={'default'}
            className="w-full rounded-full"
          >
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
