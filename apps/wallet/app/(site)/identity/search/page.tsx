'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { mainnetPublicClient } from '@/lib/wagmi/wagmi-config';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { universalDeployments } from 'universal-data';
import { useUniversalResolver } from 'universal-identity-sdk';
import { type Address, isAddress } from 'viem';
import { normalize } from 'viem/ens';
import { useAccount } from 'wagmi';

export default function IdentitySearchPage() {
  const { chainId } = useAccount();
  const { resolve } = useUniversalResolver();
  const [searchInput, setSearchInput] = useState<string>('');
  const [requestStatus, setRequestStatus] = useState<boolean>(false);

  const { data, isSuccess } = useQuery({
    queryKey: [
      'identity',
      {
        address: searchInput as Address,
        resolver: universalDeployments[chainId as number]?.resolver,
      },
    ],
    queryFn: async () => {
      let _address: Address | string = '';
      if (isAddress(searchInput)) {
        _address = searchInput as Address;
      } else if (searchInput.includes('.eth')) {
        const ensAddress = await mainnetPublicClient.getEnsAddress({
          name: normalize(searchInput),
        });
        if (ensAddress && !isAddress(ensAddress)) {
          throw new Error('Invalid ENS address');
        }
        _address = ensAddress as Address;
      }

      const ensAvatar = await mainnetPublicClient.getEnsAvatar({
        name: normalize(searchInput),
      });

      const identity = await resolve({
        address: _address as Address,
        resolver: universalDeployments[chainId as number]?.resolver,
      });
      if (!identity) {
        throw new Error('Identity not found');
      }
      if (identity) {
        setRequestStatus(false);
        return {
          status: true,
          address: _address,
          ens: {
            avatar: ensAvatar,
            name: searchInput,
          },
          identity,
        };
      }
    },
    enabled: requestStatus,
  });

  return (
    <>
      <section className="border-b-2 bg-neutral-100 py-6">
        <div className="mx-auto flex max-w-screen-lg items-center gap-x-2">
          <Input
            placeholder="Search for a user (e.x. kames.base.eth or 0x1234)"
            className="h-16 w-full flex-1 bg-white text-base placeholder:text-sm"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Button className="h-14" onClick={() => setRequestStatus(true)}>
            <Search className="size-20" />
          </Button>
        </div>
      </section>
      <section className="mx-auto py-4">
        {isSuccess && data && (
          <div className="flex h-full w-full max-w-full flex-1 flex-col items-center justify-center overflow-auto p-8 text-sm">
            <div className="w-full max-w-screen-lg">
              <div className="mb-4 flex w-full items-center justify-between">
                <h3 className="font-bold text-lg">Universal Identity</h3>
                <div className="flex items-center gap-x-4">
                  <h3 className="font-normal text-lg">
                    <span className="font-bold">
                      {data.identity.status === 1 ? 'Verified' : 'Unverified'}
                    </span>
                  </h3>
                </div>
              </div>
              <Card className='mb-4 flex w-full items-center gap-x-4 p-5'>
              <div className="flex items-center justify-center">
                {data.ens.avatar && (
                  <img
                    alt="avatar"
                    src={data.ens.avatar}
                    className="h-16 w-16 rounded-full border-4 border-white shadow-md"
                  />
                )}
              </div>
              <div className="flex-1">
                {data.ens.name && (
                  <>
                    <h3 className="font-bold text-2xl">{data.ens.name}</h3>
                    <span className="text-sm">{data.address}</span>
                  </>
                )}
              </div>
            </Card>
              <Card className="w-full p-5">
                <h3 className="mb-2 font-bold text-lg">Identifier</h3>
                <span className="mt-2 block font-bold text-neutral-500">
                  {data.identity.parsed.id}
                </span>
              </Card>
              <Card className="mt-4 w-full p-5">
                <h3 className="mb-2 font-bold text-lg">Document</h3>
                <pre className="w-auto pb-4 font-mono text-xs">{`${JSON.stringify(data.identity.data, null, 2)}`}</pre>
              </Card>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
