import type { HTMLAttributes } from 'react';
import { cn, formatNumber } from '@/lib/utils';
import { useEstimateUserOpPrice } from '@/lib/account-abstraction/hooks/use-estimate-user-op-price';
import { Skeleton } from '@/components/ui/skeleton';

type ActionTransactionFeeEstimate = HTMLAttributes<HTMLElement>;

export function ActionTransactionFeeEstimate({
  className,
}: ActionTransactionFeeEstimate) {
  const { data, isLoading, isError } = useEstimateUserOpPrice();

  if (isError) {
    return (
      <div className={cn('text-sm text-red-500 font-medium', className)}>
        Error estimating fee.
      </div>
    );
  }

  if (isLoading || !data) {
    return <Skeleton className={cn('w-14 h-5', className)} />;
  }

  return <div className={cn(className)}>${formatNumber(data)}</div>;
}
