'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import { QrCode } from 'lucide-react';
import * as React from 'react';
import { useAccount } from 'wagmi';
import { CopyIconButton } from './copy-icon-button';
import { QRCodeRender } from './qr-code-address';
import { Button } from './ui/button';

type QRIconReceiveDialog = React.HTMLAttributes<HTMLElement>;

const QRIconReceiveDialog = ({ children, className }: QRIconReceiveDialog) => {
  const { address } = useAccount();

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline" size="icon">
          <span>
            <QrCode />
            <span className="sr-only">Open QR scanner</span>
          </span>
        </Button>
      </DialogTrigger>
      {address && (
        <DialogContent className="p-10 text-center">
          <DialogHeader className="items-center">
            <DialogTitle className="font-bold text-3xl sr-only">
              Wallet Address
            </DialogTitle>
          </DialogHeader>
          <div className="rounded-3xl overflow-hidden border-4 border-neutral-300 shadow-lg">
            <QRCodeRender data={address} className="w-full h-auto" />
          </div>
          <span className="text-sm mt-4 font-semibold">{address}</span>
          <CopyIconButton value={address} />
        </DialogContent>
      )}
    </Dialog>
  );
};
export { QRIconReceiveDialog };
