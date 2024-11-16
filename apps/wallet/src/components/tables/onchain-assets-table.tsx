// @ts-nocheck
'use client';

import type React from 'react';
import { Suspense } from 'react';

import { DataTable } from '@/components/data-table/data-table';
import { cn } from '@/lib/utils';
import { tokenList } from 'universal-data';
import { ERC20Balance } from '../onchain/erc20-balance';
import { TokenImageWithFallback } from '../token-image-with-fallback';

const columns = [
  {
    accessorKey: 'name',
    header: () => <h3 className="font-semibold text-base">Name</h3>,
    cell: ({ row }) => (
      <div className="flex flex-col gap-x-3 md:flex-row md:items-center">
        <TokenImageWithFallback
          imgUri={row.original?.logoURI}
          symbol={row.original.symbol}
          className="size-5 md:size-7"
        />
        <div className="flex flex-col">
          <span className="font-bold text-sm">{row.original.symbol}</span>
          <span className="text-gray-500 text-xs">{row.original.name}</span>
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
      <h3 className="text-right font-semibold text-base">Credit Lines</h3>
    ),
    cell: ({ row }) => (
      <div className="text-right">
        <span className="font-semibold text-sm md:text-lg">0.00</span>
      </div>
    ),
  },
];

type OnchainAssetsTableProps = React.HTMLAttributes<HTMLDivElement> & {
  address: string;
  chainId: number;
};

const OnchainAssetsTable: React.FC<OnchainAssetsTableProps> = ({
  className,
  address,
  chainId,
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
