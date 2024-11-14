'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import { QrCode } from 'lucide-react';
import { useAccount } from 'wagmi';
import { CopyIconButton } from './copy-icon-button';
import { QRCodeRender } from './qr-code-address';
import { Button } from './ui/button';

const QRIconReceiveDialog = () => {
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
            <DialogTitle className="sr-only font-bold text-3xl">
              Wallet Address
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-hidden rounded-3xl border-4 border-neutral-300 shadow-lg">
            <QRCodeRender data={address} className="h-auto w-full" />
          </div>
          <span className="mt-4 break-all font-semibold text-sm">
            {address}
          </span>
          <CopyIconButton value={address} />
        </DialogContent>
      )}
    </Dialog>
  );
};
export { QRIconReceiveDialog };
