'use client';
import { ConnectButton } from '@/components/onchain/connect-button';
import { ConnectSmartWalletButton } from '@/components/onchain/connect-smart-wallet-button';
import { IsWalletConnected } from '@/components/onchain/is-wallet-connected';
import { IsWalletDisconnected } from '@/components/onchain/is-wallet-disconnected';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

import { useAccount, useDisconnect } from 'wagmi';
import { CardDashboard } from './components/dashboard-card';
import { Calendar, CreditCard, SmartphoneNfc } from 'lucide-react';

export default function HomePage() {
  const { address } = useAccount();

  return (
    <>
      <div className="w-full px-4">
        <div className="mt-4 flex flex-col gap-y-4">
          <div className="grid grid-cols-3 relative gap-x-5 w-full">
            <CardDashboard
              icon={SmartphoneNfc}
              title="Payments"
              description="Authorize pull payments with your wallet."
              link="/finance/payments"
            />
            <CardDashboard
              icon={Calendar}
              title="Subscriptions"
              description="Manage your wallet subscriptions."
              link="/finance/subscriptions"
            />
            <CardDashboard
              icon={CreditCard}
              title="Universal Cards"
              description="Manage your onchain credit streams."
              link="/finance/credit"
            />
          </div>
          <Card className="relative overflow-hidden p-0">
            <CardContent className="flex gap-y-5 p-0 default:mb-0 default:flex-col md:mb-0 md:flex-row">
              <div className="order-2 flex items-center gap-x-4 p-8 text-center md:order-1 md:w-1/2 md:p-20 md:text-left">
                <div className="flex flex-col gap-y-5">
                  <div className="text-center md:text-left">
                    <h3 className="text-3xl font-black text-emerald-500 dark:text-emerald-400 md:text-5xl">
                      Universal Wallet
                    </h3>
                    <h3 className="text-5xl font-black text-emerald-600 dark:text-emerald-400 md:text-3xl">
                      A Smart Wallet from the Future
                    </h3>
                  </div>
                </div>
              </div>
              <div className="relative z-10 order-1 flex flex-1 items-center justify-center bg-white px-8 py-16 dark:bg-neutral-900 md:order-2 md:w-1/2 md:border-l-2 md:py-8 h-auto">
                <div className="absolute inset-0 z-0">
                  <Image
                    src="/images/landing/universal-circles.png"
                    alt="Hero"
                    className="size-full object-cover"
                    width={800}
                    height={800}
                  />
                </div>
                <div className="relative z-50 text-center">
                  <IsWalletDisconnected>
                    <ConnectButton size="lg" rounded={'full'}>
                      Connect Wallet
                    </ConnectButton>
                  </IsWalletDisconnected>
                  <IsWalletConnected>
                    <span className="font-bold">Discover What's Possible</span>
                  </IsWalletConnected>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
