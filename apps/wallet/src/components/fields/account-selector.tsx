'use client';

import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import type { Address } from 'viem';
import { Button } from '../ui/button';
import { DialogDescription, DialogTitle } from '../ui/dialog';

interface AccountSelectorProps {
  disabled?: boolean;
  value: string;
  onValueChange: (account: Address) => void;
  className?: string;
}

export function AccountSelector({ disabled }: AccountSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  return (
    <>
      <Button
        type="button"
        variant={'outline'}
        className={cn('flex w-fit items-center gap-x-2 rounded-full py-2')}
        onClick={() => (disabled ? undefined : setOpen(true))}
      >
        <span className="font-medium text-md">Select</span>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="mt-4 ml-6 font-bold text-lg">
          Select Account
        </DialogTitle>
        <DialogDescription className="sr-only mt-2 ml-6 text-sm">
          Search for an account by name, address or credential.
        </DialogDescription>
        <CommandInput
          placeholder="Search name or paste address"
          value={searchValue}
          onValueChange={(value) => setSearchValue(value)}
        />
        <CommandList>
          <CommandEmpty className="py-4 text-center font-semibold text-lg">
            Contacts Coming Soon
          </CommandEmpty>
        </CommandList>
      </CommandDialog>
    </>
  );
}
