import { Card } from '@/components/ui/card';
import { type Address as AddressType } from 'viem';
import { formatNumber } from '@/lib/utils';
import { Address } from '@/components/onchain/address';

interface DebitCardProps {
  to: AddressType;
  amount?: string;
  tokenAddress?: string;
  chainId?: number;
  symbol?: string;
  name?: string;
}

export function DebitCard({ to, amount = '0', name, symbol }: DebitCardProps) {
  return (
    <Card className="w-full min-w-[320px] max-w-[400px] h-[250px] relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 rounded-2xl shadow-lg ">
      <div className="absolute top-0 right-0 w-3/5 h-4/6 bg-blue-400/20 rounded-full -translate-y-1/3 translate-x-1/3" />

      <div className="relative h-full p-6 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="text-sm font-medium">Debit Authorization</div>
            <div className="text-lg font-bold">
              <Address truncate address={to} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-4xl font-bold">{symbol}</div>
              <div className="text-sm opacity-80">{name}</div>
            </div>
            {/* <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div> */}
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
