import Image from 'next/image';

import { FormControl } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type Token, findToken, tokenDeployments } from 'universal-data';

type SelectTokenProps = {
  chainId: number;
  onValueChange?: (token: Token) => void;
  value: string;
};

export function SelectToken({
  onValueChange,
  value,
  chainId,
}: SelectTokenProps) {
  return (
    <Select
      onValueChange={(value) => {
        const selectedToken = findToken(chainId, value);
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
        {tokenDeployments[chainId].map((token) => (
          <SelectItem key={token.address} value={token.address}>
            <div className="flex items-center gap-x-4">
              <Image
                className="rounded-full shadow-lg"
                src={token.img}
                alt={`${token.name} ${token.symbol}`}
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
