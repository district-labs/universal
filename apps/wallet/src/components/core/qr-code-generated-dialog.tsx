'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { DialogTitle } from '@radix-ui/react-dialog';
import { Fingerprint, QrCode, WalletMinimal } from 'lucide-react';
import { universalDeployments } from 'universal-data';
import { constructDidIdentifier } from 'universal-identity-sdk';
import { useAccount } from 'wagmi';
import { Button } from '../ui/button';
import { QRCodeGenerate } from './qr-code-generate';

const QRCodeGeneratedDialog = () => {
  const { address, chainId } = useAccount();

  return (
    <Dialog>
      <DialogTrigger asChild={true}>
        <Button
          variant="outline"
          size="icon"
          className="border-emerald-500 text-emerald-600 hover:text-emerald-700"
        >
          <span>
            <QrCode />
            <span className="sr-only">Open QR scanner</span>
          </span>
        </Button>
      </DialogTrigger>
      {address && chainId && (
        <DialogContent className="p-10 text-center">
          <Tabs defaultValue="account" className="w-full">
            <TabsContent value="account">
              <DialogHeader className="items-center">
                <DialogTitle className="sr-only font-bold text-3xl">
                  Wallet Address
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="overflow-hidden rounded-3xl border-4 border-neutral-300 shadow-lg">
                  <QRCodeGenerate data={address} className="h-auto w-full" />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="password">
              <DialogHeader className="items-center">
                <DialogTitle className="sr-only font-bold text-3xl">
                  Wallet Address
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className=" overflow-hidden rounded-3xl border-4 border-neutral-300 shadow-lg">
                  <QRCodeGenerate
                    data={constructDidIdentifier({
                      address,
                      resolver: universalDeployments.Resolver,
                      chainId,
                    })}
                    className="h-auto w-full"
                  />
                </div>
              </div>
            </TabsContent>
            <TabsList className="mt-4 w-full">
              <TabsTrigger className="flex-1 gap-x-1" value="account">
                <WalletMinimal className="size-4" />
                Wallet
              </TabsTrigger>
              <TabsTrigger className="flex-1 gap-x-1" value="password">
                <Fingerprint className="size-4" />
                Identity
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </DialogContent>
      )}
    </Dialog>
  );
};
export { QRCodeGeneratedDialog };
