import { Button } from '@/components/ui/button';
import { closePopup } from '@/lib/pop-up/actions/close-pop-up';
import { cn } from '@/lib/utils';
import type * as React from 'react';

type ActionRequestFooter = React.HTMLAttributes<HTMLElement> & {
  isFixed?: boolean;
};

export const ActionRequestFooter = ({
  children,
  className,
  isFixed,
}: ActionRequestFooter) => {
  return (
    <div
      className={cn(
        'z-50 flex w-full items-center gap-x-4 border-neutral-200 border-t-2 bg-white p-4',
        {
          'fixed right-0 bottom-0 left-0': isFixed,
        },
        className,
      )}
    >
      <Button
        variant={'outline'}
        className="w-full flex-1 rounded-full"
        size="lg"
        onClick={() => closePopup()}
      >
        Cancel
      </Button>
      {children}
    </div>
  );
};
