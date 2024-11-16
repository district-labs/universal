'use client';
import { useAccount } from 'wagmi';
import { ViewCreditReceived } from './view-credit-received';

export default function FinanceTransferPage() {
  const { address } = useAccount();

  if (!address) {
    return null;
  }
  return (
    <>
      <section className="border-b-2 bg-neutral-100/30 py-6">
        <div className="container flex w-full flex-col items-center gap-2 md:flex-row md:justify-between">
          <h3 className="font-bold text-2xl md:text-3xl">Credit</h3>
          <p className="">Spending allowances sent from other wallets.</p>
        </div>
      </section>
      <section className="h-full bg-neutral-100/50 py-4 md:py-8">
        <div className="2xl container">
          <ViewCreditReceived delegate={address} />
        </div>
      </section>
    </>
  );
}
