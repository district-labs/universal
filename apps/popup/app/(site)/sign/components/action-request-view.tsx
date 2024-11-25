import { cn } from '@/lib/utils';
import type * as React from 'react';

type ActionRequestView = React.HTMLAttributes<HTMLElement>;

export const ActionRequestView = ({
  children,
  className,
}: ActionRequestView) => {
  return (
    <div
      className={cn(
        'flex h-full w-full flex-1 flex-col justify-between',
        className,
      )}
    >
      {children}
    </div>
  );
};
