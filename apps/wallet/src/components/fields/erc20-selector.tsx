'use client';

import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { useCallback, useMemo, useState } from 'react';
import type { TokenItem, TokenList } from 'universal-data';
import { Button } from '../ui/button';
import { DialogDescription, DialogTitle } from '../ui/dialog';

interface TokenSelectorProps {
  disabled?: boolean;
  value: TokenItem;
  onValueChange: (token: TokenItem) => void;
  className?: string;
  tokenList: TokenList;
}

export function TokenSelector({
  disabled,
  value,
  onValueChange,
  tokenList,
}: TokenSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const filteredTokenList = useMemo(() => {
    if (tokenList?.tokens && tokenList.tokens.length > 0) {
      return tokenList.tokens.filter((token: TokenItem) => {
        const tokenName = token.name.toLowerCase();
        const tokenSymbol = token.symbol.toLowerCase();
        const tokenAddress = token.address.toLowerCase();
        const isTokenMatch =
          tokenName.includes(searchValue.toLowerCase()) ||
          tokenSymbol.includes(searchValue.toLowerCase()) ||
          tokenAddress.includes(searchValue.toLowerCase());

        return isTokenMatch;
      });
    }
    return [] as TokenItem[];
  }, [tokenList?.tokens, searchValue]);

  const handleSelect = useCallback(
    (token: TokenItem) => {
      onValueChange(token);
      setOpen(false);
      setSearchValue('');
    },
    [onValueChange],
  );

  return (
    <>
      <Button
        type="button"
        variant={'outline'}
        className={cn(
          'flex w-fit items-center gap-x-2 rounded-full py-2',
          // className,
        )}
        onClick={() => (disabled ? undefined : setOpen(true))}
      >
        {value && (
          <>
            <img
              width="25"
              height="25"
              alt={`${value?.name} logo`}
              className="rounded-full"
              src={value?.logoURI}
            />
            <span className="font-bold text-lg">{value.symbol}</span>
          </>
        )}
        {!value && <span className="font-medium text-md">Select Token</span>}
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="mt-4 ml-6 font-bold text-lg">
          Select Token
        </DialogTitle>
        <DialogDescription className="sr-only mt-2 ml-6 text-sm">
          Search for a token by name, symbol or address.
        </DialogDescription>
        <CommandInput
          placeholder="Search for a token by name, symbol or address."
          value={searchValue}
          onValueChange={(value) => setSearchValue(value)}
        />
        <CommandList>
          <CommandEmpty>No tokens found.</CommandEmpty>
          {filteredTokenList &&
            filteredTokenList.length > 0 &&
            filteredTokenList.map((token: TokenItem) => (
              <CommandItem
                key={token.address}
                value={token.name}
                className="flex cursor-pointer"
                onSelect={() => handleSelect(token)}
              >
                <div className="flex items-center gap-x-2 p-2">
                  <img
                    width="32"
                    height="32"
                    alt={`${token.name} logo`}
                    className="rounded-full"
                    src={token.logoURI}
                  />
                  <div className="space-y-0.5">
                    <h3 className="font-medium text-base">{token.name}</h3>
                    <p className="text-muted-foreground text-xs">
                      {token.symbol}
                    </p>
                  </div>
                </div>
              </CommandItem>
            ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
