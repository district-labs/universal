import { Skeleton } from '@/components/ui/skeleton';
import { useEstimateUserOpPrice } from '@/lib/account-abstraction/hooks/use-estimate-user-op-price';
import { cn, formatNumber } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

type ActionTransactionFeeEstimate = HTMLAttributes<HTMLElement>;

export function ActionTransactionFeeEstimate({
  className,
}: ActionTransactionFeeEstimate) {
  const { data, isLoading, isError } = useEstimateUserOpPrice();

  if (isError) {
    return (
      <div className={cn('font-medium text-red-500 text-sm', className)}>
        Error estimating fee.
      </div>
    );
  }

  if (isLoading || !data) {
    return <Skeleton className={cn('h-5 w-14', className)} />;
  }

  return (
    <div className={cn(className)}>
      <span className="text-primary/60 line-through">
        ${formatNumber(data)}
      </span>{' '}
      | <span className="text-emerald-700">FREE</span>
    </div>
  );
}
