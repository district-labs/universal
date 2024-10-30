import * as React from 'react';
import { cn } from '@/lib/utils';

type ActionRequestView = React.HTMLAttributes<HTMLElement>;

const ActionRequestView = ({ children, className }: ActionRequestView) => {
  return (
    <div
      className={cn(
        'flex flex-1 w-full flex-col h-full justify-between',
        className,
      )}
    >
      {children}
    </div>
  );
};
export { ActionRequestView };
