'use client';
import { FormerErc20Transfer } from './form-erc20-transfer';

export default function FinanceTransferPage() {
  return (
    <>
      <section className="border-b-2 bg-neutral-100/30 py-6">
        <div className="container flex w-full flex-col items-center gap-2 md:flex-row md:justify-between">
          <h3 className="font-bold text-2xl md:text-3xl">Transfer</h3>
          <p className="">Send assets to another wallet.</p>
        </div>
      </section>
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
