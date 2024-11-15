'use client';
import { FormerErc20Transfer } from './form-erc20-transfer';

export default function FinanceTransferPage() {
  return (
    <>
      <section className="flex h-full flex-col items-center justify-center bg-neutral-100">
        <div className="mx-auto w-full max-w-screen-sm p-4">
          <h3 className="mb-4 text-center font-black text-4xl text-foreground-muted">
            Transfer Assets
          </h3>
          <FormerErc20Transfer />
          <p className="mt-2 text-center text-sm">
            Testnet tokens will be automatically minted during transfer.
          </p>
        </div>
      </section>
    </>
  );
}
