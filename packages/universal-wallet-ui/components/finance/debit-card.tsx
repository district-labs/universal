import React from 'react';

import { Address } from '../onchain/address';
import { type Address as AddressType } from 'viem';
import { formatNumber } from '../utils';
import { Card } from '../ui/card';

interface DebitCard {
  to: AddressType;
  amount?: string;
  tokenAddress?: string;
  chainId?: number;
  symbol?: string;
  name?: string;
}

export function DebitCard({ to, amount = '0', name, symbol }: DebitCard) {
  return (
    <Card className="w-full min-w-[320px] max-w-[400px] h-[250px] relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 rounded-2xl shadow-lg ">
      <div className="absolute top-0 right-0 w-3/5 h-4/6 bg-blue-400/20 rounded-full -translate-y-1/3 translate-x-1/3" />

      <div className="relative h-full p-6 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="text-sm font-medium">Debit Authorization</div>
            {
                to && (
                    <div className="text-lg font-bold">
                    <Address truncate address={to} />
                    </div>
                )
            }
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-4xl font-bold">{symbol}</div>
              <div className="text-sm opacity-80">{name}</div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="">
            <div className="text-normal font-medium opacity-80">Total</div>
            <div className="flex items-center">
              <span className="font-bold text-3xl">{formatNumber(amount)}</span>
              <span className="text-xl font-medium ml-1">{symbol}</span>
            </div>
          </div>
          <div className="flex items-center gap-2"></div>
        </div>
      </div>
    </Card>
  );
}
