import {
  type DelegationExecutions,
  DelegationsManagementSheet,
} from '@/components/delegations-management-sheet';
import { Address } from '@/components/onchain/address';
import { CreditCard } from 'lucide-react';
import type * as React from 'react';
import type { Address as AddressType } from 'viem';

type DelegationManager = React.HTMLAttributes<HTMLElement> & {
  address?: AddressType;
  chainId?: number;
  setDelegationExecutions: (delegation: DelegationExecutions[]) => void;
  delegationExecutions: DelegationExecutions[];
};

const DelegationManager = ({
  className,
  address,
  chainId,
  setDelegationExecutions,
  delegationExecutions,
}: DelegationManager) => {
  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <span className="text-sm">Credit Lines</span>
        {address && chainId && (
          <DelegationsManagementSheet
            address={address}
            chainId={chainId}
            onSelect={setDelegationExecutions}
          >
            <span className="cursor-pointer font-bold text-sm">Manage</span>
          </DelegationsManagementSheet>
        )}
      </div>
      {delegationExecutions?.map((delegation) => (
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
