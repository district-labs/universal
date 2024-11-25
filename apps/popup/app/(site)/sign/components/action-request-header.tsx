import { cn } from '@/lib/utils';

type ActionRequestHeader = React.HTMLAttributes<HTMLElement>;

export const ActionRequestHeader = ({
  children,
  className,
}: ActionRequestHeader) => {
  return (
    <div
      className={cn(
        'relative z-40 w-full bg-neutral-100 px-5 py-2 pt-4 text-center',
        className,
      )}
    >
      {children}
    </div>
  );
};
