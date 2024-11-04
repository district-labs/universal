import Image from 'next/image';

import { FormControl } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Token = {
  address: string;
  name: string;
  symbol: string;
  img: string;
  decimals: number;
};

const TOKENS: Token[] = [
  {
    address: '0x25a00587cEe81a29db94e47E9B4b618439FC5E6f',
    name: 'USD Test',
    symbol: 'USD',
    decimals: 18,
    img: '/images/erc20/usdc.png',
  },
  {
    address: '0xb80aaFbE600329Eee68E55A46565412946EEC57F',
    name: 'Emerald Gems',
    symbol: 'GEM',
    decimals: 18,
    img: '/images/erc20/gem.png',
  },
];

type SelectTokenProps = {
  onValueChange?: (token: Token) => void;
  value: string;
};

export function SelectToken({ onValueChange, value }: SelectTokenProps) {
  return (
    <Select
      onValueChange={(value) => {
        const selectedToken = TOKENS.find((token) => token.address === value);
        onValueChange?.(selectedToken!);
      }}
      value={value}
    >
      <FormControl>
        <SelectTrigger className="h-fit">
          <SelectValue placeholder={'Select a token'} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {TOKENS.map((token) => (
          <SelectItem key={token.address} value={token.address}>
            <div className="flex items-center gap-x-4">
              <Image
                className="rounded-full shadow-lg"
                src={token.img}
                alt={token.name + ' ' + token.symbol}
                width={24}
                height={24}
              />
              <h3 className="font-medium">{token.name}</h3>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
