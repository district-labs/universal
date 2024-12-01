import { cn } from '@/lib/utils';
import type * as React from 'react';
import {
  type DelegationDb,
  useDelegationStatus,
} from 'universal-delegations-sdk';
import { Badge } from '../ui/badge';

type DelegationStatus = React.HTMLAttributes<HTMLElement> & {
  delegation: DelegationDb;
};

export const DelegationStatus = ({
  className,
  delegation,
}: DelegationStatus) => {
  const { data: status } = useDelegationStatus({
    delegationManager: delegation.verifyingContract,
    delegation: delegation,
  });

  if (status === undefined) {
    return null;
  }

  if (status === null) {
    return <div className={cn(className)}>Error</div>;
  }

  if (status === false) {
    return (
      <Badge variant={'green'} className={cn(className)}>
        Active
      </Badge>
    );
  }

  return (
    <Badge variant={'destructive'} className={cn(className)}>
      Disabled
    </Badge>
  );
};
