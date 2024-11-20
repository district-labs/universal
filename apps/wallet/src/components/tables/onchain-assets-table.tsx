// @ts-nocheck
'use client';

import type React from 'react';
import { Suspense } from 'react';

import { DataTable } from '@/components/data-table/data-table';
import { cn } from '@/lib/utils';
import { tokenList } from 'universal-data';
import { ERC20Balance } from '../onchain/erc20-balance';
import { TokenImageWithFallback } from '../onchain/token-image-with-fallback';

const columns = [
  {
    accessorKey: 'name',
    header: () => <h3 className="font-semibold text-base">Name</h3>,
    cell: ({ row }) => (
      <div className="flex flex-row gap-x-1 md:flex-row md:items-center md:gap-x-3">
        <TokenImageWithFallback
          imgUri={row.original?.logoURI}
          symbol={row.original.symbol}
          className="size-4 md:size-7"
        />
        <div className="flex flex-col">
          <span className="font-bold text-sm">{row.original.symbol}</span>
          <span className="hidden text-gray-500 text-xs md:inline-block">
            {row.original.name}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'balance',
    header: () => <h3 className="font-semibold text-base">Balance</h3>,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <ERC20Balance
          address={row.original.address}
          className="font-semibold text-sm md:text-lg"
        />
      </div>
    ),
  },
  {
    accessorKey: 'credit',
    header: () => (
      <h3 className="text-right font-semibold text-base">Credit</h3>
    ),
    cell: ({ row }) => (
      <div className="text-right">
        <span className="font-semibold text-sm md:text-lg">0.00</span>
      </div>
    ),
  },
];

type OnchainAssetsTableProps = React.HTMLAttributes<HTMLDivElement> & {};

const OnchainAssetsTable: React.FC<OnchainAssetsTableProps> = ({
  className,
}) => {
  const classes = cn('onchain-assets-table', className);

  return (
    <div className={classes}>
      <Suspense fallback={<div>Loading...</div>}>
        <DataTable
          tableName="Tokens"
          columns={columns}
          data={tokenList.tokens}
          pageCount={10}
          disablePagination={true}
        />
      </Suspense>
    </div>
  );
};

export { OnchainAssetsTable };
