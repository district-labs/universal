import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type * as React from 'react';
import type { Address } from 'viem';
import { FormerErc20Transfer } from '../forms/form-erc20-transfer';

type AccountTransferDialogProps = React.HTMLAttributes<HTMLElement> & {
  address: Address;
  token: Address;
};

export const AccountTransferDialog = ({
  address,
  token,
  children,
}: AccountTransferDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild={true}>{children}</DialogTrigger>
      <DialogContent className="md:max-w-screen-md">
        <DialogHeader className="text-left sm:text-left">
          <DialogTitle className="sr-only font-black text-4xl">
            Asset Transfer
          </DialogTitle>
          <DialogDescription className="sr-only">
            Transfer assets to another address.
          </DialogDescription>
        </DialogHeader>
        <FormerErc20Transfer
          defaultValues={{
            to: address,
            token,
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
