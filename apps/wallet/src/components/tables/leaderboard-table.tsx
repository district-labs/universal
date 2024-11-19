// @ts-nocheck
'use client';

import type React from 'react';
import { Suspense } from 'react';

import { DataTable } from '@/components/data-table/data-table';
import { cn, formatNumber } from '@/lib/utils';
import Image from 'next/image';
import { findTokenBySymbol } from 'universal-data';
import { useGetLeaderboard } from 'universal-sdk';
import { useAccount } from 'wagmi';
import { CopyIconButton } from '../core/copy-icon-button';
import { CredentialSocialIcon } from '../identity/credential-social-icon';
import { Address } from '../onchain/address';
import { ERC20Balance } from '../onchain/erc20-balance';
import { LinkComponent } from '../ui/link-component';

type LeaderboardTableProps = React.HTMLAttributes<HTMLDivElement> & {};

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ className }) => {
  const classes = cn('onchain-assets-table', className);
  const { chainId } = useAccount();
  const { data } = useGetLeaderboard({
    asset: '0xE3Cfc3bB7c8149d76829426D0544e6A76BE5a00B',
    chainId: chainId,
  });

  if (!data) {
    return null;
  }

  return (
    <div className={classes}>
      <Suspense fallback={<div>Loading...</div>}>
        <DataTable
          tableName="Leaderboard"
          columns={columns}
          data={data}
          pageCount={10}
          disablePagination={true}
        />
      </Suspense>
    </div>
  );
};

export { LeaderboardTable };

const columns = [
  {
    accessorKey: 'address',
    header: () => <h3 className="font-semibold text-base">Name</h3>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Address truncate={true} address={row.original.address} />
        <CopyIconButton value={row.original.address} />
      </div>
    ),
  },
  {
    accessorKey: 'credentials',
    header: () => <h3 className="font-semibold text-base">Credentials</h3>,
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        {row.original.credentials.map((credential) => {
          return (
            <div
              key={credential.credentialSubject.id}
              className="flex flex-row items-center gap-1"
            >
              <CredentialSocialIcon
                size={10}
                type={credential.credentialSubject.platform}
              />
              <LinkComponent
                href={credential.credentialSubject.platformProfileUrl}
                className="font-normal text-xs"
              >
                {credential.credentialSubject.handle}
              </LinkComponent>
            </div>
          );
        })}
      </div>
    ),
  },
  {
    accessorKey: 'balance',
    header: () => (
      <h3 className="text-left font-semibold text-base">Balance</h3>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Image
          className="rounded-full border-2 border-white shadow-md"
          src={findTokenBySymbol('USD')?.logoURI}
          alt="Ethereum"
          width={20}
          height={20}
        />
        <ERC20Balance
          className="font-semibold text-neutral-500 text-sm md:text-lg"
          account={row.original.address}
          address={findTokenBySymbol('USD')?.address}
        />
      </div>
    ),
  },
  {
    accessorKey: 'creditIn',
    header: () => (
      <h3 className="text-right font-semibold text-base">Credit In</h3>
    ),
    cell: ({ row }) => (
      <div className="text-right">
        <span
          className={cn('font-semibold text-neutral-500 text-sm md:text-lg', {
            'text-green-600': row.original.creditIn > '0',
          })}
        >
          {formatNumber(row.original.creditIn)}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'creditOut',
    header: () => (
      <h3 className="text-right font-semibold text-base">Credit Out</h3>
    ),
    cell: ({ row }) => (
      <div className="text-right">
        <span
          className={cn('font-semibold text-neutral-500 text-sm md:text-lg', {
            'text-red-600': row.original.creditOut > '0',
          })}
        >
          {formatNumber(row.original.creditOut)}
        </span>
      </div>
    ),
  },
];
