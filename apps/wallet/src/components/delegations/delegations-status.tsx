import { cn } from '@/lib/utils';
import { useDelegationStatus } from 'universal-delegations-sdk';
import type { DelegationWithMetadata } from 'universal-types';
import { Badge } from '../ui/badge';

type DelegationStatus = React.HTMLAttributes<HTMLElement> & {
  delegation: DelegationWithMetadata;
};

export const DelegationStatus = ({
  className,
  delegation,
}: DelegationStatus) => {
  const { data: status } = useDelegationStatus({
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
