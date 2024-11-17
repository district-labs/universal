'use client';
import { FormerErc20Transfer } from './form-erc20-transfer';

export default function FinanceTransferPage() {
  return (
    <>
      <section className="flex h-full flex-col bg-neutral-100 md:items-center md:justify-center">
        <div className="mx-auto w-full max-w-screen-sm p-4">
          <FormerErc20Transfer />
          <p className="mt-2 text-center text-sm">
            Testnet tokens will be automatically minted during transfer.
          </p>
        </div>
      </section>
    </>
  );
}
