// @ts-nocheck
'use client';

import type React from 'react';
import { Suspense } from 'react';

import { DataTable } from '@/components/data-table/data-table';
import { cn, formatNumber } from '@/lib/utils';
import { EllipsisVertical } from 'lucide-react';
import Image from 'next/image';
import { findTokenByAddress } from 'universal-data';
import { useGetLeaderboard } from 'universal-sdk';
import { baseSepolia } from 'viem/chains';
import { AccountInteractDialog } from '../core/account-interact-dialog';
import { CopyIconButton } from '../core/copy-icon-button';
import { CredentialSocialIcon } from '../identity/credential-social-icon';
import { Address } from '../onchain/address';
import { ERC20Balance } from '../onchain/erc20-balance';
import { Button } from '../ui/button';
import { LinkComponent } from '../ui/link-component';
import { Skeleton } from '../ui/skeleton';

type LeaderboardTableProps = React.HTMLAttributes<HTMLDivElement> & {};

const DEFAULT_LEADERBOARD_ASSET = '0xE3Cfc3bB7c8149d76829426D0544e6A76BE5a00B';
const DEFAULT_LEADERBOARD_CHAIN_ID = baseSepolia.id;

const LeaderboardTable: React.FC<LeaderboardTableProps> = () => {
  const { data } = useGetLeaderboard({
    asset: DEFAULT_LEADERBOARD_ASSET,
    chainId: DEFAULT_LEADERBOARD_CHAIN_ID,
  });

  if (!data) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  return (
    <Suspense fallback={null}>
      <DataTable
        tableName="Leaderboard"
        columns={columns}
        data={data}
        pageCount={1}
      />
    </Suspense>
  );
};

export { LeaderboardTable };

const columns = [
  {
    accessorKey: 'credentials',
    header: () => <h3 className="font-semibold text-sm">Socials</h3>,
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        {row.original.credentials.map((credential) => {
          return (
            <div
              key={credential.credentialSubject.platform}
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
    accessorKey: 'address',
    header: () => <h3 className="font-semibold text-sm">Account</h3>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Address truncate={true} address={row.original.address} />
        <CopyIconButton value={row.original.address} />
      </div>
    ),
  },
  {
    accessorKey: 'balance',
    header: () => <h3 className="text-left font-semibold text-sm">Balance</h3>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Image
          className="rounded-full border-2 border-white shadow-md"
          src={findTokenByAddress(DEFAULT_LEADERBOARD_ASSET)?.logoURI}
          alt="Ethereum"
          width={20}
          height={20}
        />
        <ERC20Balance
          className="font-semibold text-neutral-500 text-sm md:text-lg"
          account={row.original.address}
          address={findTokenByAddress(DEFAULT_LEADERBOARD_ASSET)?.address}
        />
      </div>
    ),
  },
  {
    accessorKey: 'creditIn',
    header: () => (
      <h3 className="text-right font-semibold text-sm">Credit In</h3>
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
      <h3 className="text-right font-semibold text-sm">Credit Out</h3>
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
  {
    accessorKey: 'actions',
    header: () => <h3 className="text-right font-semibold text-xs">Actions</h3>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <AccountInteractDialog
          address={row.original.address}
          chainId={DEFAULT_LEADERBOARD_CHAIN_ID}
        >
          <Button size="icon" variant={'outline'} className="text-xs">
            <EllipsisVertical />
          </Button>
        </AccountInteractDialog>
      </div>
    ),
  },
];
