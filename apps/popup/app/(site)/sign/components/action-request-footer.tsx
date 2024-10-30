import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { closePopup } from '@/lib/pop-up/actions/close-pop-up';

type ActionRequestFooter = React.HTMLAttributes<HTMLElement> & {
  isFixed?: boolean;
};

const ActionRequestFooter = ({
  children,
  className,
  isFixed,
}: ActionRequestFooter) => {
  return (
    <div
      className={cn(
        'flex items-center gap-x-4 w-full border-t-2 p-4 border-neutral-200 z-50 bg-white',
        {
          'fixed bottom-0 left-0 right-0': isFixed,
        },
        className,
      )}
    >
      <Button
        variant={'outline'}
        className="flex-1 w-full rounded-full"
        size="lg"
        onClick={() => closePopup()}
      >
        Cancel
      </Button>
      {children}
    </div>
  );
};
export { ActionRequestFooter };
