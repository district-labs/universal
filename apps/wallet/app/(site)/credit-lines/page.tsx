'use client';
import { ConnectUniversalWalletButton } from '@/components/onchain/connect-universal-wallet';
import { useAccount } from 'wagmi';
import { ViewCreditLines } from './view-credit-lines';

export default function CreditLinePage() {
  const { address } = useAccount();

  return (
    <div className="flex h-full flex-col">
      <section className="border-b-2 bg-neutral-100/30 py-6">
        <div className="container flex w-full flex-col items-center gap-2 md:flex-row md:justify-between">
          <h3 className="font-bold text-2xl">Credit Lines</h3>
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
          {address && <ViewCreditLines delegate={address} />}
        </div>
      </section>
    </div>
  );
}
