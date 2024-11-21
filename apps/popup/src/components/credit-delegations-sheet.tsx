import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import type * as React from 'react';
import {
  type DelegationDb,
  decodeEnforcerERC20TransferAmount,
} from 'universal-delegations-sdk';
import { useGetCredit } from 'universal-sdk';
import type { Address } from 'viem';
import { RowBasic } from './row-basic';
import { Card } from './ui/card';

type CreditDelegationsSheet = React.HTMLAttributes<HTMLElement> & {
  address: Address;
};

export const CreditDelegationsSheet = ({
  children,
  className,
  address,
}: CreditDelegationsSheet) => {
  console.log(address, 'address');
  const { data } = useGetCredit({
    address,
  });

  console.log(data, 'data');

  return (
    <div className={cn(className)}>
      <Sheet>
        <SheetTrigger asChild={true}>{children}</SheetTrigger>
        <SheetContent side="bottom" className="top-6">
          <SheetHeader>
            <SheetTitle className="text-2xl">Credit Lines</SheetTitle>
            <SheetDescription className="text-base">
              Select a credit line to use for this transaction.
            </SheetDescription>
          </SheetHeader>
          <div className='mt-4 space-y-2'>
            {data?.map((delegation) => (
              <CardAuthorization
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

type CardAuthorization = React.HTMLAttributes<HTMLElement> & {
  delegation: DelegationDb;
};

const CardAuthorization = ({ delegation }: CardAuthorization) => {
  const decodedTerms = decodeEnforcerERC20TransferAmount(
    delegation.caveats[0].terms,
  );
  return (
    <Card key={delegation.hash} className="flex flex-col gap-y-3 p-4">
      <RowBasic label="From" value={delegation.delegator} />
      <RowBasic label="Amount" value={`${decodedTerms[1]}`} />
    </Card>
  );
};
