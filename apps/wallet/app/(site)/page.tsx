'use client';
import { AddFundsTestnet } from '@/components/add-funds-testnet';
import { OnchainAssetsTable } from '@/components/tables/onchain-assets-table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="space-y-6">
      <section className="border-b-2 bg-neutral-100/30 py-6">
          <div className="container flex w-full flex-col items-center gap-2 md:flex-row md:justify-between">
            <h3 className="font-bold text-2xl md:text-3xl">Assets</h3>
            <div className="flex flex-1 items-center justify-end gap-x-2">
            <AddFundsTestnet>
              <Button rounded={'lg'}>Add Funds</Button>
            </AddFundsTestnet>
          </div>
          </div>
        </section>
      <section className="gap-x-8 space-y-4 px-6">
        <div className='container'>
          <Card className="p-6">
            <OnchainAssetsTable address="0x1234" chainId={1} />
          </Card>
        </div>
      </section>
    </div>
  );
}
