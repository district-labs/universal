import { Ban, KeySquare } from 'lucide-react';
import type * as React from 'react';
import {
  useDelegationStatus,
  useDisableDelegation,
  useEnableDelegation,
} from 'universal-delegations-sdk';
import type { DelegationWithMetadata } from 'universal-types';
import { Button } from '../ui/button';

type DelegationToggle = React.HTMLAttributes<HTMLElement> & {
  delegation: DelegationWithMetadata;
};

export const DelegationToggle = ({
  className,
  delegation,
}: DelegationToggle) => {
  const { data: status } = useDelegationStatus({
    delegation: delegation,
  });

  const { disable } = useDisableDelegation({
    delegation: delegation,
  });
  const { enable } = useEnableDelegation({
    delegation: delegation,
  });

  return (
    <Button
      onClick={status ? enable : disable}
      className={className}
      rounded={'full'}
      variant={status ? 'emerald' : 'destructive'}
    >
      {status ? (
        <>
          Re-activate
          <KeySquare className="ml-0 size-2" />
        </>
      ) : (
        <>
          Revoke
          <Ban className="ml-0 size-2" />
        </>
      )}
    </Button>
  );
};
