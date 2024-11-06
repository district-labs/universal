'use client';
import { useAccount } from 'wagmi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { ViewCreate } from './view-create';
import { ViewSent } from './view-sent';
import { ViewReceived } from './view-received';
import { ERC20Balance } from '@/components/onchain/erc20-balance';
import { tokenDeployments } from 'universal-wallet-data';
import { Address, formatUnits, parseUnits } from 'viem';
import { ERC20Mint } from '@/components/onchain/erc20-mint-button';
import { Button } from '@/components/ui/button';
import { ViewPageConnectWallet } from '@/components/views/view-page-connect-wallet';

export default function FinanceCardsPage() {
  const { address } = useAccount();
  return (
    <>
      <section>
        <Tabs defaultValue="account" className="w-full">
          <div className="bg-neutral-100 w-full p-3 px-8 sticky top-0 flex ">
            <TabsList className="max-w-screen-sm">
              <TabsTrigger value="account">Create</TabsTrigger>
              <TabsTrigger value="debit">Debit</TabsTrigger>
              <TabsTrigger value="credit">Credit</TabsTrigger>
            </TabsList>
          </div>
          <div className="px-8 pt-4">
            <TabsContent value="account" className="p-0">
              <Card className="flex justify-between items-center w-full mb-4 p-4">
                <div className="font-bold">
                  {' '}
                  Universal Credit | Start Playing the Game
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
                  <div className="flex items-center gap-x-2 rounded-full border-2 dark:border-neutral-600 px-4 py-2 font-black text-emerald-600">
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
              <Card className="p-0 max-w-screen-xls mx-auto">
                <ViewCreate />
              </Card>
              <Card className="mt-4 p-4  w-full mx-auto content">
                <div>
                  <h3 className="font-bold text-lg">How It Works</h3>
                  <p>
                    The Universal Credit prototype utilizes a powerful new way
                    to share permissions between onchain accounts.
                  </p>
                  <ol className="list-decimal list-inside pl-4 mb-4">
                    <li>Connect Universal Wallet.</li>
                    <li>Mint GEMs on Base Sepolia.</li>
                    <li>
                      Sign an offchain authorization to approve a P2P credit
                      line.
                    </li>
                  </ol>
                  <p className="">
                    <span className="font-bold">That's it!</span> Now the credit
                    line is established and the receiving party can claim the
                    GEMs.
                  </p>
                </div>
              </Card>
            </TabsContent>
            <TabsContent value="debit">
              <ViewPageConnectWallet className="w-full h-auto flex items-center justify-center">
                {address && <ViewSent delegator={address} />}
              </ViewPageConnectWallet>
            </TabsContent>
            <TabsContent value="credit">
              <ViewPageConnectWallet className="w-full h-auto flex items-center justify-center">
                {address && <ViewReceived delegate={address} />}
              </ViewPageConnectWallet>
            </TabsContent>
          </div>
        </Tabs>
      </section>
    </>
  );
}
