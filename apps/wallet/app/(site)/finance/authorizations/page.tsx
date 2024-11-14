'use client';
import { ERC20Balance } from '@/components/onchain/erc20-balance';
import { ERC20Mint } from '@/components/onchain/erc20-mint-button';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ViewPageConnectWallet } from '@/components/views/view-page-connect-wallet';
import { tokenDeployments } from 'universal-data';
import { type Address, parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import { ViewCreate } from './view-create';
import { ViewReceived } from './view-received';
import { ViewSent } from './view-sent';

export default function FinanceCardsPage() {
  const { address } = useAccount();
  return (
    <>
      <section>
        <Tabs defaultValue="account" className="w-full">
          <div className="sticky top-0 flex w-full bg-neutral-100 p-3 px-8 ">
            <TabsList className="max-w-screen-sm">
              <TabsTrigger value="account">Create</TabsTrigger>
              <TabsTrigger value="debit">Debit</TabsTrigger>
              <TabsTrigger value="credit">Credit</TabsTrigger>
            </TabsList>
          </div>
          <div className="px-8 pt-4">
            <TabsContent value="account" className="p-0">
              <Card className="mb-4 flex w-full flex-col items-center justify-between gap-y-4 p-4 md:flex-row">
                <div>
                  <span>
                    <span className="font-bold">Universal Trust</span> | Start
                    Playing the Game
                  </span>
                </div>
                <div className="flex items-center gap-x-3">
                  <ERC20Mint
                    address={tokenDeployments[84532][0].address as Address}
                    amount={parseUnits('100', 18)}
                    to={address}
                  >
                    <Button
                      className="font-bold"
                      variant={'emerald'}
                      rounded={'full'}
                    >
                      Mint 100 GEM
                    </Button>
                  </ERC20Mint>
                  <div className="flex items-center gap-x-2 rounded-full border-2 px-4 py-2 font-black text-emerald-600 dark:border-neutral-600">
                    <ERC20Balance
                      address={tokenDeployments[84532][0].address as Address}
                      account={address}
                      className="text-xl"
                    />
                    <span className="text-lg">
                      {tokenDeployments[84532][0].symbol}
                    </span>
                  </div>
                </div>
              </Card>
              <Card className="mx-auto max-w-screen-xls p-0">
                <ViewCreate />
              </Card>
              <Card className="content mx-auto mt-4 w-full p-4">
                <div>
                  <h3 className="font-bold text-lg">How It Works</h3>
                  <p>
                    The Universal Trust network utilizes a powerful new way to
                    share permissions between onchain accounts.
                  </p>
                  <ol className="mb-4 list-inside list-decimal pl-4">
                    <li>Connect Universal Wallet.</li>
                    <li>Mint GEMs on Base Sepolia.</li>
                    <li>
                      Sign an offchain authorization to approve a peer-to-peer
                      credit line.
                    </li>
                  </ol>
                  <p>
                    <span className="font-bold">That's it!</span> Now the credit
                    line is established and the receiving party can claim the
                    GEMs.
                  </p>
                </div>
              </Card>
            </TabsContent>
            <TabsContent value="debit">
              <ViewPageConnectWallet className="flex h-auto w-full items-center justify-center">
                {address && <ViewSent delegator={address} />}
              </ViewPageConnectWallet>
            </TabsContent>
            <TabsContent value="credit">
              <ViewPageConnectWallet className="flex h-auto w-full items-center justify-center">
                {address && <ViewReceived delegate={address} />}
              </ViewPageConnectWallet>
            </TabsContent>
          </div>
        </Tabs>
      </section>
    </>
  );
}
