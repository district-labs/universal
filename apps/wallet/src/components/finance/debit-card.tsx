import { DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface DebitCardProps {
  amount?: string;
  tokenAddress?: string;
  chainId?: number;
  symbol?: string;
  name?: string;
}

export default function DebitCard({
  amount = '0',
  tokenAddress = '0x...',
  chainId = 1,
  name = 'Token',
  symbol = 'TOK',
}: DebitCardProps) {
  return (
    <Card className="w-full min-w-[320px] max-w-[400px] h-[250px] relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 rounded-2xl shadow-lg ">
      <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-blue-400/20 rounded-full -translate-y-1/2 translate-x-1/4" />

      <div className="relative h-full p-6 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="text-xs font-medium opacity-80">Total Balance</div>
            <div className="text-4xl font-bold flex items-center">
              <span className="text-3xl mr-1">$</span>
              {amount}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-2xl font-bold">{name}</div>
              <div className="text-xs opacity-80">{symbol} Coin</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-lg font-medium">Universal Card</div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium">Base</span>
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-blue-500" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
