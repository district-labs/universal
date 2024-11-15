import type { Dispatch } from 'react';

import type { Address } from 'viem';
import { CameraQrScanner } from '../camera/camera-qr-scanner';
import { FormDescription, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import { AccountSelector } from './account-selector';

interface AccountSelectAndInput {
  disabled?: boolean;
  valueAccount: Address | undefined;
  onAccountChange: Dispatch<Address>;
  valueContact: Address;
  onContactSelected: (account: Address) => void;
}

export function AccountSelectAndInput({
  disabled,
  valueAccount,
  onAccountChange,
  valueContact,
  onContactSelected,
}: AccountSelectAndInput) {
  return (
    <div className="group relative w-full">
      <FormLabel className="text-foreground text-lg">To</FormLabel>
      <div className="my-1 flex w-full items-center justify-between gap-2">
        <Input
          disabled={disabled}
          id="amount"
          className="block h-auto w-full flex-1 border-transparent bg-transparent py-1 pl-0 text-left font-medium text-base shadow-none placeholder:text-muted-foreground placeholder:text-sm focus:border-transparent focus:ring-transparent focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-transparent"
          placeholder="Ethereum address or ENS name"
          value={valueAccount}
          onChange={(e) => onAccountChange(e.target.value as Address)}
        />
        <div className="flex items-center gap-x-2">
          <AccountSelector
            disabled={disabled}
            value={valueContact}
            onValueChange={onContactSelected}
          />
          <CameraQrScanner
            onScanSuccess={(data: string) => onAccountChange(data as Address)}
          />
        </div>
      </div>
      <FormDescription>Account receiving the assets/tokens.</FormDescription>
    </div>
  );
}
