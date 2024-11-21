'use client';
import { ConnectUniversalWalletButton } from '@/components/onchain/connect-universal-wallet';
import { useGetCredit } from 'universal-sdk';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';
import { ViewCreditReceived } from './view-credit-received';
export default function FinanceTransferPage() {
  const { address } = useAccount();
  const { data } = useGetCredit({
    address: address as Address,
    chainId: 84532,
  });

  console.log(data, 'data');

  return (
    <div className="flex h-full flex-col">
      <section className="border-b-2 bg-neutral-100/30 py-6">
        <div className="container flex w-full flex-col items-center gap-2 md:flex-row md:justify-between">
          <h3 className="font-bold text-2xl">Credit</h3>
          <p className="hidden text-sm md:block">
            Claim assets your friends credited you.
          </p>
        </div>
      </section>
      <section className="flex-1 bg-neutral-100/50 py-4 md:py-8">
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
          {address && <ViewCreditReceived delegate={address} />}
        </div>
      </section>
    </div>
  );
}
