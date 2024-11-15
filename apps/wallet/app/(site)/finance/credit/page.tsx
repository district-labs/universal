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
      <section className="border-b-2 bg-neutral-100/70 py-6">
        <div className="2xl container mx-auto w-full">
          <h3 className="font-bold text-3xl">Credit Lines</h3>
          <p className="">Manage credit lines others have authorized to you.</p>
        </div>
      </section>
      <section className="h-full bg-neutral-100/50 p-6">
        <div className="2xl container">
          <ViewCreditReceived delegate={address} />
        </div>
      </section>
    </>
  );
}
