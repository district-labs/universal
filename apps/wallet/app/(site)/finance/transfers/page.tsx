'use client';
import { FormerErc20Transfer } from './form-erc20-transfer';

export default function FinanceTransferPage() {
  return (
    <>
      <section className="flex h-full flex-col items-center justify-center bg-neutral-100">
        <div className="mx-auto w-full max-w-screen-sm p-4">
          <FormerErc20Transfer />
        </div>
      </section>
    </>
  );
}
