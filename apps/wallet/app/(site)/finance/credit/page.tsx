'use client';
import { ConnectUniversalWalletButton } from '@/components/onchain/connect-universal-wallet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { defaultChain } from '@/lib/chains';
import { CreditCard, TableProperties } from 'lucide-react';
import { useAccount } from 'wagmi';
import { ViewCreditCards } from './view-cards';
import { ViewCreditTable } from './view-table';

export default function FinanceCreditPage() {
  const { address } = useAccount();
  return (
    <div className="h-full">
      <Tabs defaultValue="table" className=" flex h-full w-full flex-col p-0">
        <section className="border-b-2 bg-neutral-100/30 py-3">
          <div className="container flex flex-row items-center justify-between gap-2">
            <h3 className="font-semibold text-lg lg:text-xl">Credit Lines</h3>
            <TabsList className="max-w-screen-sm">
              <TabsTrigger value="table">
                <TableProperties className="mr-2 size-4" />
              </TabsTrigger>
              <TabsTrigger value="card">
                <CreditCard className="mr-2 size-4" />
              </TabsTrigger>
            </TabsList>
          </div>
        </section>
        <div className="mt-6 flex-1 lg:h-auto">
          <TabsContent value="card" className="m-0 h-full p-0">
            <section className="h-full">
              <div className="container">
                {!address && (
                  <div className="flex flex-col items-center justify-center">
                    <ConnectUniversalWalletButton
                      size="lg"
                      className="rounded-full py-3 text-lg"
                    >
                      Connect Universal Wallet
                    </ConnectUniversalWalletButton>
                  </div>
                )}
                {address && (
                  <ViewCreditTable
                    chainId={defaultChain.id}
                    delegate={address}
                  />
                )}
              </div>
            </section>
          </TabsContent>
          <TabsContent value="table" className="m-0 h-full p-0">
            <section className="h-full">
              <div className="container">
                {!address && (
                  <div className="flex flex-col items-center justify-center">
                    <ConnectUniversalWalletButton
                      size="lg"
                      className="rounded-full py-3 text-lg"
                    >
                      Connect Universal Wallet
                    </ConnectUniversalWalletButton>
                  </div>
                )}
                {address && <ViewCreditCards delegate={address} />}
              </div>
            </section>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
