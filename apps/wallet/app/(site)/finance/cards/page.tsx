'use client';

import { useAccount } from 'wagmi';
import { FinanceCardView } from './view';

export default function FinanceCardsPage() {
  const { address } = useAccount();

  return (
    <>
      <section>
        <FinanceCardView />
      </section>
    </>
  );
}
