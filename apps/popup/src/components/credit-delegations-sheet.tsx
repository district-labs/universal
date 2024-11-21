import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import type { DelegationExecutions } from 'app/(site)/sign/wallet-send-calls/page';
import type * as React from 'react';
import { useState } from 'react';
import { findTokenByAddress } from 'universal-data';
import {
  type DelegationDb,
  decodeEnforcerERC20TransferAmount,
} from 'universal-delegations-sdk';
import { useGetCredit } from 'universal-sdk';
import { type Address, formatUnits } from 'viem';
import { RowBasic } from './row-basic';
import { Card } from './ui/card';

type CreditDelegationsSheet = Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> & {
  address: Address;
  onSelect: (delegation: DelegationExecutions[]) => void;
};

export const CreditDelegationsSheet = ({
  children,
  className,
  address,
  onSelect,
}: CreditDelegationsSheet) => {
  const { data } = useGetCredit({
    address,
  });

  const [isOpen, toggleSheet] = useState(false);

  return (
    <div className={cn(className)}>
      <Sheet open={isOpen}>
        <SheetTrigger asChild={true} onClick={() => toggleSheet(!isOpen)}>
          {children}
        </SheetTrigger>
        <SheetContent side="bottom" className="top-6">
          <SheetHeader>
            <SheetTitle className="text-2xl">Credit Lines</SheetTitle>
            <SheetDescription className="text-base">
              Select a credit line to use for this transaction.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4 space-y-2">
            {data?.map((delegation) => (
              <CardAuthorization
                toggleSheet={toggleSheet}
                onSelect={onSelect}
                key={delegation.hash}
                delegation={delegation as DelegationDb}
              />
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

type CardAuthorization = Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> & {
  delegation: DelegationDb;
  onSelect: (delegation: DelegationExecutions[]) => void;
  toggleSheet: (isOpen: boolean) => void;
};

const CardAuthorization = ({
  delegation,
  onSelect,
  toggleSheet,
}: CardAuthorization) => {
  const decodedTerms = decodeEnforcerERC20TransferAmount(
    delegation.caveats[0].terms,
  );

  const token = findTokenByAddress(decodedTerms[0] as Address);

  return (
    <Card
      key={delegation.hash}
      className="flex cursor-pointer flex-col gap-y-3 p-4 hover:shadow-md"
      onClick={() => {
        onSelect([
          {
            delegation,
            execution: {
              hash: delegation.hash,
              amount: decodedTerms[1],
              amountFormatted: formatUnits(
                BigInt(decodedTerms[1]),
                token?.decimals || 0,
              ),
            },
            token: {
              name: token?.name || '',
              symbol: token?.symbol || '',
              decimals: token?.decimals || 0,
            },
          },
        ]);
        toggleSheet(false);
      }}
    >
      <RowBasic label="From" value={delegation.delegator} />
      <RowBasic label="Amount" value={`${decodedTerms[1]}`} />
    </Card>
  );
};
