'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { DebitCard } from 'universal-wallet-ui';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';
import { FormErc20Authorize, type FormSchema } from './form-erc20-authorize';
import { ViewErc20AuthorizationsSent } from './view-erc20-authorizations-sent';

export default function FinanceAuthorizationPage() {
  const { address } = useAccount();
  const [data, setData] = useState<FormSchema>();
  return (
    <>
      <Tabs defaultValue="account" className="h-full w-full p-0">
        <div className='sticky top-0 flex w-full border-b-2 bg-neutral-100/60 p-3 px-8 '>
          <TabsList className="max-w-screen-sm">
            <TabsTrigger value="account">Create</TabsTrigger>
            <TabsTrigger value="debit">Manage</TabsTrigger>
          </TabsList>
        </div>
        <div className="h-full">
          <TabsContent value="account" className="m-0 h-full p-0">
            <section className="h-full">
              <div className="flex h-full w-full flex-col items-center lg:flex-row lg:justify-center">
                <div className="order-2 flex w-full flex-col bg-neutral-100 py-6 lg:order-1 lg:h-full">
                  <div className="flex flex-1 flex-col items-center justify-center px-12">
                    <FormErc20Authorize onFormChange={setData} />
                  </div>
                </div>
                <div className="order-1 flex w-full flex-col py-6 lg:order-2 lg:h-full lg:border-l-2">
                  <div className="flex flex-1 flex-col items-center justify-center">
                    <DebitCard
                      amount={data?.amount || '0'}
                      to={data?.to as Address}
                      tokenAddress={data?.token?.address}
                      symbol={data?.token?.symbol}
                      name={data?.token?.name}
                    />
                  </div>
                </div>
              </div>
            </section>
          </TabsContent>
          <TabsContent value="debit" className="m-0 h-full p-0">
            <section className="h-full p-8">
              <ViewErc20AuthorizationsSent delegator={address as Address} />
            </section>
          </TabsContent>
          <TabsContent value="credit">hello</TabsContent>
        </div>
      </Tabs>
    </>
  );
}
