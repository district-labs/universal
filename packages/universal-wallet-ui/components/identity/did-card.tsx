import React from 'react';

import { Fingerprint } from 'lucide-react';
import type { Address } from 'viem';
import { Card } from '../ui/card';
import { cn, truncateEthAddress } from '../utils';

export type DIDCard = {
  chainId: number;
  resolver: Address;
  account: Address;
  color?: 'default' | 'blue' | 'green' | 'red' | 'yellow' | 'purple';
};

export function DIDCard({
  chainId,
  resolver,
  account,
  color = 'default',
}: DIDCard) {
  return (
    <Card
      className={cn(
        {
          'from-blue-500 to-blue-600': color === 'blue',
          'from-purple-500 to-purple-600': color === 'purple',
          'from-green-500 to-green-600': color === 'green',
          'from-red-500 to-red-600': color === 'red',
          'from-yellow-500 to-yellow-600': color === 'yellow',
          'from-neutral-500 to-neutral-600': color === 'default',
        },
        'relative h-[250px] w-full min-w-[320px] max-w-[400px] overflow-hidden rounded-2xl border-0 bg-gradient-to-br text-white shadow-lg',
      )}
    >
      <div className='absolute right-0 bottom-0 h-[200px] w-[200px] translate-x-1/3 translate-y-1/3 rounded-full bg-white/20' />
      <div className='relative flex h-full flex-col justify-between p-6'>
        <div className='w-full'>
          <div className="space-y-2 w-full">
            <div className='flex items-center justify-between gap-x-2'>
              <span className='font-bold text-xl'>Universal Identity</span>
                <Fingerprint size={24}  />
              </div>
            <div className="space-y-1">
              <div className="font-mono text-xs">
                {`did:uis:${chainId}:${truncateEthAddress(resolver, 7)}:${truncateEthAddress(account)}`}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-y-2 ">
          <div className="space-y-1">
            <div className='font-black text-base'>Resolver</div>
            <div className="font-mono text-xs">{resolver}</div>
          </div>
          <div className="space-y-1">
            <div className='font-black text-base'>Account</div>
            <div className="font-mono text-xs">{account}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
