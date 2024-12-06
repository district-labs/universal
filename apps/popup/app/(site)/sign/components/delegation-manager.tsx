import { DelegationsManagementSheet } from '@/components/delegations-management-sheet';
import { Address } from '@/components/onchain/address';
import { CreditCard } from 'lucide-react';
import type * as React from 'react';
import type { CreditLineExecutions } from 'universal-types';
import type { Address as AddressType } from 'viem';

type DelegationManager = React.HTMLAttributes<HTMLElement> & {
  address?: AddressType;
  chainId?: number;
  setCreditLineExecutions: (delegation: CreditLineExecutions[]) => void;
  CreditLineExecutions: CreditLineExecutions[];
};

const DelegationManager = ({
  className,
  address,
  chainId,
  setCreditLineExecutions,
  CreditLineExecutions,
}: DelegationManager) => {
  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <span className="text-sm">Credit Lines</span>
        {address && chainId && (
          <DelegationsManagementSheet
            address={address}
            chainId={chainId}
            onSelect={setCreditLineExecutions}
          >
            <span className="cursor-pointer font-bold text-sm">Manage</span>
          </DelegationsManagementSheet>
        )}
      </div>
      {CreditLineExecutions?.map((delegation) => (
        <div key={delegation.execution.hash} className="flex justify-between">
          <div className="">
            <Address
              className="text-xs"
              truncate={true}
              address={delegation.delegation.delegator}
            />
          </div>
          <div className="flex flex-row items-end justify-end gap-y-1">
            <span className="flex items-center gap-x-1 font-bold text-neutral-500 text-sm">
              {delegation?.execution?.amountFormatted}{' '}
              {delegation?.token?.symbol}
              <CreditCard className="size-4" />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
export { DelegationManager };
