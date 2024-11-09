'use client';
import { useAccount } from 'wagmi';
import { ViewTransfer } from './view-transfer';
import { Card } from '@/components/ui/card';
import { QRCodeEthereumAddress } from '@/components/qr-code-address';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp } from 'lucide-react';

export default function FinanceCardsPage() {
  const { address } = useAccount();
  return (
    <>
      <section className="h-full">
        <div className="w-full h-full flex flex-col lg:flex-row items-center lg:justify-center">
          <div className="bg-neutral-100 w-full flex flex-col lg:h-full py-6 order-2 lg:order-1">
            <span className="mx-auto">
              <Button
                variant={'outline'}
                className="mx-auto mb-4 font-bold text-center rounded-full pl-4 pr-3"
              >
                <span className=''>Transfer</span>
                <ArrowUp className="ml-4" />
              </Button>
            </span>
            <div className="flex flex-col items-center justify-center flex-1 px-12">
              <Card className="p-4 w-full">
                <ViewTransfer />
              </Card>
            </div>
          </div>
          <div className="w-full flex flex-col lg:h-full py-6 order-1 lg:order-2 lg:border-l-2">
            {/* <h1 className="lg:text-3xl mb-4 font-bold text-center">Receive</h1> */}
            <span className="mx-auto">
              <Button
                variant={'outline'}
                className="mx-auto mb-4 font-bold text-center rounded-full pl-4 pr-3"
              >
                Receive
                <ArrowDown className="ml-4" />
              </Button>
            </span>
            <div className="flex flex-col items-center justify-center flex-1">
              <Card className="p-4">
                <QRCodeEthereumAddress
                  address={address}
                  className="size-48 lg:size-auto"
                />
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
