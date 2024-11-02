'use client';

import * as React from 'react';

import { useGetBalancesERC20 } from '@/lib/hooks/use-get-balances-erc20';
import { cn, formatNumber, trimFormattedBalance } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/data-table/data-table';
import { TokenImageWithFallback } from '../token-image-with-fallback';

const columns = [
  {
    accessorKey: 'name',
    header: () => <h3 className="text-lg font-semibold">Name</h3>,
    cell: ({ row }: any) => (
      <div className="flex items-center gap-x-3">
        <TokenImageWithFallback
          imgUri={row.original?.imgUri}
          symbol={row.original.symbol}
          className="size-8"
        />
        <div className="flex flex-col gap-y-1">
          <span className="text-lg font-bold">{row.original.name}</span>
          <span className="text-sm">{row.original.symbol}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'balance',
    header: () => <h3 className="text-lg font-semibold">Balance</h3>,
    cell: ({ row }: any) => (
      <div className="flex flex-col ">
        <span className="text-lg font-bold">
          ${trimFormattedBalance(String(row.original.quote), 2)}
        </span>
        <span className="text-lg">
          {trimFormattedBalance(String(row.original.balance), 2)}{' '}
          <span className="text-sm">{row.original.symbol}</span>
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'price',
    header: () => <h3 className="text-lg font-semibold">Price</h3>,
    cell: ({ row }: any) => (
      <span className="text-lg font-semibold">
        ${formatNumber(String(row.original.price))}
      </span>
    ),
  },
];

type OnchainAssetsTable = React.HTMLAttributes<HTMLElement> & {
  address: string;
  chainId: number;
};

const OnchainAssetsTable = ({
  className,
  address,
  chainId,
}: OnchainAssetsTable) => {
  const classes = cn('onchain-assets-table', className);
  const { data, isError, isLoading } = useGetBalancesERC20({
    chainId: chainId,
    address: address,
  });

  if (isLoading) {
    return <Skeleton className="h-[320px] w-full" />;
  }

  if (isError) {
    return (
      <section className="flex h-96 flex-col items-center justify-center">
        <h1 className="text-2xl text-gray-500">Error Fetching Results</h1>
        <span className="text-muted-foreground">
          Double check your search filters...
        </span>
      </section>
    );
  }

  if (data) {
    return (
      <div className={classes}>
        <DataTable
          tableName="Onchain Assets"
          columns={columns}
          data={data}
          pageCount={10}
          disablePagination
        />
      </div>
    );
  }
  return null;
};

export { OnchainAssetsTable };
