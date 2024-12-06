'use client';
import { useAccount } from 'wagmi';
import { ViewCreditLines } from './view-credit-lines';

export default function CreditLinePage() {
  const { address } = useAccount();

  return (
    <div className="flex h-full flex-col">
      <section className="border-b-2 bg-neutral-100/30 py-3">
        <div className="container flex w-full flex-col items-center gap-2 md:flex-row md:justify-between">
          <h3 className="font-semibold text-lg lg:text-xl">Redemptions</h3>
        </div>
      </section>
      <section className="mt-6 flex-1 pb-4 md:pb-8">
        <div className="container">
          {!address && (
            <div className="flex flex-col items-center justify-center">
              Connect a wallet to view redemptions.
            </div>
          )}
          {address && <ViewCreditLines delegate={address} />}
        </div>
      </section>
    </div>
  );
}
