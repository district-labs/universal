import { cn } from '@/lib/utils';
import type * as React from 'react';

type ActionRequestMain = React.HTMLAttributes<HTMLElement>;

const ActionRequestMain = ({ children, className }: ActionRequestMain) => {
  return (
    <div
      className={cn(
        'relative z-50 mx-auto flex w-full max-w-screen-sm flex-1 flex-col px-6',
        className,
      )}
    >
      {children}
    </div>
  );
};
export { ActionRequestMain };
