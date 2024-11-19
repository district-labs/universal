// @ts-nocheck
'use client';

import type React from 'react';
import { Suspense } from 'react';

import { DataTable } from '@/components/data-table/data-table';
import { cn, formatNumber } from '@/lib/utils';
import Image from 'next/image';
import { findTokenBySymbol } from 'universal-data';
import { useGetLeaderboard } from 'universal-sdk';
import { CopyIconButton } from '../core/copy-icon-button';
import { CredentialSocialIcon } from '../identity/credential-social-icon';
import { Address } from '../onchain/address';
import { ERC20Balance } from '../onchain/erc20-balance';
import { LinkComponent } from '../ui/link-component';

const MOCK_DATA = [
  {
    account: '0xAa8201ec154Aa4869A974C62B3eAB0404d67653b',
    credentials: [
      {
        credentialSubject: {
          id: 'did:uis:84532:0x305f57c997A35E79F6a59CF09A9d07d2408b5935:0x4e6083C2FA5787587b090BeBb59bbC9569378Edd',
          handle: '@KamesGeraghty',
          platform: 'x',
          verifiedAt: '2024-11-14T14:34:03.300Z',
          platformUserId: '1506253502925869061',
          platformProfileUrl: 'https://x.com/KamesGeraghty',
        },
      },
      {
        credentialSubject: {
          id: 'did:uis:84532:0x305f57c997A35E79F6a59CF09A9d07d2408b5935:0xAa8201ec154Aa4869A974C62B3eAB0404d67653b',
          handle: '@kamescg',
          platform: 'github',
          verifiedAt: '2024-11-15T01:09:43.783Z',
          platformUserId: 3408362,
          platformProfileUrl: 'https://github.com/kamescg',
        },
      },
    ],
  },
];

type LeaderboardTableProps = React.HTMLAttributes<HTMLDivElement> & {};

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ className }) => {
  const classes = cn('onchain-assets-table', className);
  const { data } = useGetLeaderboard();

  console.log(data, 'data');

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
