// @ts-nocheck
'use client';

import type React from 'react';
import { Suspense } from 'react';

import { DataTable } from '@/components/data-table/data-table';
import { cn } from '@/lib/utils';
import { useGetLeaderboard } from 'universal-sdk';
import { CredentialSocialIcon } from '../identity/credential-social-icon';
import { Address } from '../onchain/address';
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
  const {data } = useGetLeaderboard();

  console.log(data, 'data')

  return (
    <div className={classes}>
      <Suspense fallback={<div>Loading...</div>}>
        <DataTable
          tableName="Leaderboard"
          columns={columns}
          data={MOCK_DATA}
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
    accessorKey: 'account',
    header: () => <h3 className="font-semibold text-base">Name</h3>,
    cell: ({ row }) => (
      <div className="">
        <Address truncate={true} address={row.original.account} />
      </div>
    ),
  },
  {
    accessorKey: 'credentials',
    header: () => <h3 className="font-semibold text-base">Credentials</h3>,
    cell: ({ row }) => (
      <div className="flex flex-row gap-x-2">
        {row.original.credentials.map((credential) => {
          return (
            <div
              key={credential.credentialSubject.id}
              className="flex flex-row items-center gap-1"
            >
              <CredentialSocialIcon size={14} type={credential.credentialSubject.platform} />
              <LinkComponent
                href={credential.credentialSubject.platformProfileUrl}
                className="font-normal text-sm"
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
    accessorKey: 'creditIssued',
    header: () => (
      <h3 className="text-right font-semibold text-base">Credit Issued</h3>
    ),
    cell: ({ row }) => (
      <div className="text-right">
        <span className="font-semibold text-sm md:text-lg">0.00</span>
      </div>
    ),
  },
  {
    accessorKey: 'creditReceived',
    header: () => (
      <h3 className="text-right font-semibold text-base">Credit Received</h3>
    ),
    cell: ({ row }) => (
      <div className="text-right">
        <span className="font-semibold text-sm md:text-lg">0.00</span>
      </div>
    ),
  },
];

