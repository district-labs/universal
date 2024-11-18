'use client';
import { AddFundsTestnet } from '@/components/core/add-funds-testnet';
import { OnchainAssetsTable } from '@/components/tables/onchain-assets-table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-6">
      <section className="border-b-2 bg-neutral-100/30 py-6">
        <div className="container flex w-full flex-row items-center justify-between gap-2">
          <h3 className="font-bold text-2xl">Leaderboard</h3>
          <div className="flex flex-1 items-center justify-end gap-x-2">
            <AddFundsTestnet>
              <Button rounded={'lg'}>
                <Trophy className="size-5" />
                Join Leaderboard
              </Button>
            </AddFundsTestnet>
          </div>
        </div>
      </section>
      <section>
        <div className="container">
          <Card className="p-6">
            <OnchainAssetsTable address="0x1234" chainId={1} />
          </Card>
        </div>
      </section>
    </div>
  );
}
