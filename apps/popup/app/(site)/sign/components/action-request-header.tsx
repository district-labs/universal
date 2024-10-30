import * as React from 'react';
import { cn } from '@/lib/utils';

type ActionRequestHeader = React.HTMLAttributes<HTMLElement>;

const ActionRequestHeader = ({ children, className }: ActionRequestHeader) => {
  return (
    <div
      className={cn(
        'text-center bg-neutral-100 w-full pt-4 px-5 py-2 z-40 relative',
        className,
      )}
    >
      {children}
    </div>
  );
};
export { ActionRequestHeader };
