import type * as React from 'react';
import {
  type DelegationDb,
  useDelegationStatus,
  useDisableDelegation,
  useEnableDelegation,
} from 'universal-delegations-sdk';
import { Button } from '../ui/button';

type DelegationToggle = React.HTMLAttributes<HTMLElement> & {
  delegation: DelegationDb;
};

export const DelegationToggle = ({
  className,
  delegation,
}: DelegationToggle) => {
  const { data: status } = useDelegationStatus({
    delegationManager: delegation.verifyingContract,
    delegation: delegation,
  });

  const { disable } = useDisableDelegation({
    delegationManager: delegation.verifyingContract,
    delegation: delegation,
  });
  const { enable } = useEnableDelegation({
    delegationManager: delegation.verifyingContract,
    delegation: delegation,
  });

  return (
    <Button
      onClick={status ? enable : disable}
      className={className}
      // rounded={'full'}
      variant={status ? 'emerald' : 'default'}
    >
      {status ? 'Activate' : 'Revoke'}
    </Button>
  );
};