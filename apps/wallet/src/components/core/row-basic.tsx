import { cn } from '@/lib/utils';
import type * as React from 'react';
import { isAddress } from 'viem';
import { Address } from '../onchain/address';

export type RowBasic = React.HTMLAttributes<HTMLElement> & {
  label: string;
  value: string;
};

export const RowBasic = ({ label, value }: RowBasic) => {
  return (
    <div
      className={cn('flex justify-between', {
        'flex-col gap-y-2': value.length > 20 && !isAddress(value),
      })}
    >
      <span
        className={cn('text-sm capitalize', {
          'font-bold': value.length > 20 && !isAddress(value),
        })}
      >
        {label}
      </span>
      <span
        className={cn('font-bold text-sm', {
          'font-normal': value.length > 20 && !isAddress(value),
        })}
      >
        {isAddress(value) ? <Address truncate={true} address={value} /> : value}
      </span>
    </div>
  );
};
