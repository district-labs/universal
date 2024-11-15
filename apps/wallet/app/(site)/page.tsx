'use client';
import { AddFundsTestnet } from '@/components/add-funds-testnet';
import { OnchainAssetsTable } from '@/components/tables/onchain-assets-table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="space-y-6">
      <section className="border-b-2 bg-neutral-100/70 px-6 py-6">
        <div className="flex w-full items-center justify-between">
          <div className="">
            <h3 className="font-semibold text-xl">Assets</h3>
          </div>
          <div className="flex flex-1 items-center justify-end gap-x-2">
            <AddFundsTestnet>
              <Button rounded={'lg'}>Add Funds</Button>
            </AddFundsTestnet>
          </div>
        </div>
      </section>
      <section className="gap-x-8 space-y-4 px-6">
        <Card className="flex flex-col p-6 md:flex-row md:justify-between">
          <h3 className="font-bold text-lg">Universal Credit</h3>
          <div className="">
            <p className="">
              Connect with friends to increase your{' '}
              <span className="font-bold">credit lines</span>.
            </p>
          </div>
        </Card>
        <Card className="p-6">
          <OnchainAssetsTable address="0x1234" chainId={1} />
        </Card>
      </section>
    </div>
  );
}
