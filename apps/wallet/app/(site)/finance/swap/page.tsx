'use client';
import { FormErc20Swap } from '@/components/forms/form-erc20-swap';

export default function FinanceSwapPage() {
  return (
    <>
      <section className="flex h-full flex-col bg-neutral-100 md:items-center md:justify-center">
        <div className="mx-auto w-full max-w-screen-sm p-4">
          <FormErc20Swap />
        </div>
      </section>
    </>
  );
}
