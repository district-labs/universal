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
      <section className="h-full bg-neutral-100/50 p-6">
        <div>
          <ViewCreditReceived delegate={address} />
        </div>
      </section>
    </>
  );
}
