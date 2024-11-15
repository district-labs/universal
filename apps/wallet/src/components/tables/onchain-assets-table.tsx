// @ts-nocheck
'use client';

import type * as React from 'react';
import { Suspense } from 'react';

import { DataTable } from '@/components/data-table/data-table';
import { cn } from '@/lib/utils';
import { tokenList } from 'universal-data';
import { ERC20Balance } from '../onchain/erc20-balance';
import { TokenImageWithFallback } from '../token-image-with-fallback';

const columns = [
  {
    accessorKey: 'name',
    header: () => <h3 className="font-semibold text-lg">Name</h3>,
    cell: ({ row }) => (
      <div className="flex items-center gap-x-3">
        <TokenImageWithFallback
          imgUri={row.original?.logoURI}
          symbol={row.original.symbol}
          className="size-7"
        />
        <div className="flex flex-col gap-y-0">
          <span className="font-black text-xl">{row.original.symbol}</span>
          <span className="text-sm">{row.original.name}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'balance',
    header: () => <h3 className="font-semibold text-lg">Balance</h3>,
    cell: ({ row }: any) => (
      <div className="flex flex-col ">
        <ERC20Balance
          address={row.original.address}
          className="font-bold text-2xl"
        />
      </div>
    ),
  },
  {
    accessorKey: 'credit',
    header: () => (
      <h3 className="text-right font-semibold text-lg">Credit Lines</h3>
    ),
    cell: ({ row }: any) => (
      <div className="text-right">
        <span className="font-bold text-2xl">0.00</span>
      </div>
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

  const data = [
    {
      name: 'Ethereum',
      symbol: 'ETH',
      balance: 0.0001,
      quote: 0.0001,
      price: 0.0001,
      imgUri: 'https://etherscan.io/token/images/ethereum_32.png',
    },
    {
      name: 'Wrapped Ether',
      symbol: 'WETH',
      balance: 0.0001,
      quote: 0.0001,
      price: 0.0001,
      imgUri: 'https://etherscan.io/token/images/weth_32.png',
    },
    {
      name: 'Tether USD',
      symbol: 'USDT',
      balance: 0.0001,
      quote: 0.0001,
      price: 0.0001,
      imgUri: 'https://etherscan.io/token/images/tether_32.png',
    },
  ];

  if (data) {
    return (
      <div className={classes}>
        <Suspense>
          <DataTable
            tableName="Currency"
            columns={columns}
            data={tokenList.tokens}
            pageCount={10}
            disablePagination={true}
          />
        </Suspense>
      </div>
    );
  }
  return null;
};

export { OnchainAssetsTable };
