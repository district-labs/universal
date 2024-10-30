import * as React from 'react';
import { cn } from '@/lib/utils';

type ActionRequestMain = React.HTMLAttributes<HTMLElement>;

const ActionRequestMain = ({ children, className }: ActionRequestMain) => {
  return (
    <div
      className={cn(
        'flex-1 flex flex-col w-full px-6 relative z-50 max-w-screen-sm mx-auto',
        className,
      )}
    >
      {children}
    </div>
  );
};
export { ActionRequestMain };
