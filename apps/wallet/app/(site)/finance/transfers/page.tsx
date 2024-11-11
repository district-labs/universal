'use client';
import { useAccount } from 'wagmi';
import { ViewTransfer } from './view-transfer';
import { Card } from '@/components/ui/card';
import { QRCodeRender } from '@/components/qr-code-address';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp } from 'lucide-react';

export default function FinanceCardsPage() {
  const { address } = useAccount();
  return (
    <>
      <section className="h-full">
        <div className='flex h-full w-full flex-col items-center lg:flex-row lg:justify-center'>
          <div className='order-2 flex w-full flex-col bg-neutral-100 py-6 lg:order-1 lg:h-full'>
            <span className="mx-auto">
              <Button
                variant={'outline'}
                className='mx-auto mb-4 rounded-full pr-3 pl-4 text-center font-bold'
              >
                <span className="">Transfer</span>
                <ArrowUp className="ml-4" />
              </Button>
            </span>
            <div className='flex flex-1 flex-col items-center justify-center px-12'>
              <Card className='w-full p-4'>
                <ViewTransfer />
              </Card>
            </div>
          </div>
          <div className='order-1 flex w-full flex-col py-6 lg:order-2 lg:h-full lg:border-l-2'>
            {/* <h1 className="lg:text-3xl mb-4 font-bold text-center">Receive</h1> */}
            <span className="mx-auto">
              <Button
                variant={'outline'}
                className='mx-auto mb-4 rounded-full pr-3 pl-4 text-center font-bold'
              >
                Receive
                <ArrowDown className="ml-4" />
              </Button>
            </span>
            <div className='flex flex-1 flex-col items-center justify-center'>
              <Card className="p-4">
                <QRCodeRender
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
