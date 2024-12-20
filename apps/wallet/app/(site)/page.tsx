'use client';
import { AddFundsTestnet } from '@/components/core/add-funds-testnet';
import { OnchainAssetsTable } from '@/components/tables/onchain-assets-table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { isProductionEnv } from '@/lib/chains';
import { PlusCircle } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-6">
      {/* Only displays the section above if is on testnet */}
      <section className="border-b-2 bg-neutral-100/30 py-3">
        <div className="container flex w-full flex-row items-center justify-between gap-2">
          <h3 className="font-semibold text-lg lg:text-xl">Assets</h3>
          <div className="flex flex-1 items-center justify-end gap-x-2">
            {!isProductionEnv && (
              <AddFundsTestnet>
                <Button rounded={'full'}>
                  <PlusCircle className="size-5" />
                  Mint Tokens
                </Button>
              </AddFundsTestnet>
            )}
          </div>
        </div>
      </section>

      <section>
        <div className="container max-w-[100vw] md:max-w-[1400px]">
          <Card className="p-6">
            <OnchainAssetsTable />
          </Card>
        </div>
      </section>
    </div>
  );
}
