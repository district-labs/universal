// @ts-nocheck
'use client';

import type React from 'react';
import { Suspense } from 'react';

import { DataTable } from '@/components/data-table/data-table';
import Image from 'next/image';
import { leaderboardTokenList } from 'universal-data';
import { CopyIconButton } from '../core/copy-icon-button';
import { AccountAddress } from '../onchain/account-address';

type LeaderboardMetricsTableProps = React.HTMLAttributes<HTMLDivElement> & {};

const DEFAULT_LEADERBOARD_CHAIN_ID = 1;

const LeaderboardMetricsTable: React.FC<LeaderboardMetricsTableProps> = () => {
  return (
    <Suspense fallback={null}>
      <DataTable
        tableName="Trust Multipliers"
        columns={columns}
        data={leaderboardTokenList.tokens.filter(
          (token) => token.chainId === DEFAULT_LEADERBOARD_CHAIN_ID,
        )}
        pageCount={1}
      />
    </Suspense>
  );
};

export { LeaderboardMetricsTable };

const columns = [
  {
    accessorKey: 'token',
    header: () => <h3 className="font-semibold text-sm">Token</h3>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Image
          src={row.original.logoURI}
          className="rounded-full shadow-lg"
          width={28}
          height={28}
        />
        <div className="flex flex-col">
          <span className="font-bold text-xl">{row.original.symbol}</span>
          <span className="font-medium text-xs">{row.original.name}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'address',
    header: () => <h3 className="font-semibold text-sm">Network</h3>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <img
          className="size-4"
          alt="Base L2"
          src="https://avatars.githubusercontent.com/u/108554348?v=4"
        />
        Base L2
      </div>
    ),
  },
  {
    accessorKey: 'address',
    header: () => <h3 className="font-semibold text-sm">Address</h3>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <AccountAddress
          className="link"
          truncate={true}
          isLink={true}
          address={row.original?.extensions?.bridgeInfo?.['8453']?.tokenAddress}
        />
        <CopyIconButton
          value={row.original?.extensions?.bridgeInfo?.['8453']?.tokenAddress}
        />
      </div>
    ),
  },
  {
    accessorKey: 'multiplier',
    header: () => (
      <h3 className="text-right font-semibold text-sm">Multiplier</h3>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-1">
        <span className="font-bold text-2xl">
          {row?.original?.extensions?.multiplier || '0'}x
        </span>
      </div>
    ),
  },
];
