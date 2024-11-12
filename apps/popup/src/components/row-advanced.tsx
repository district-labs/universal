import { cn } from '@/lib/utils';
import type * as React from 'react';

export type RowAdvanced = React.HTMLAttributes<HTMLElement> & {
  label: string;
  value: string;
  direction?: 'row' | 'column';
};

export const RowAdvanced = ({
  label,
  value,
  direction = 'row',
}: RowAdvanced) => {
  return (
    <div
      className={cn('flex flex-row justify-between', {
        'flex-col gap-y-2': direction === 'column',
      })}
    >
      <span className={cn('text-sm capitalize')}>{label}</span>
      <span className={cn('font-bold text-xs')}>{value}</span>
    </div>
  );
};
