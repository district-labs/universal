'use client';
import { FormErc20Swap } from '@/components/forms/form-erc20-swap';
import { AssetsListView } from '@/components/views/assets-list-view';
import Image from 'next/image';

export default function FinanceSwapPage() {
  return (
    <>
      <section className="flex h-full flex-col bg-neutral-100">
        <div className="mx-auto grid h-full w-full grid-cols-12 gap-x-4 p-0">
          <div className="col-span-4 space-y-2 bg-white p-4 px-6 shadow-xl transition-shadow hover:shadow-2xl md:order-0">
            <div className="flex h-full flex-col">
              <div className="border-neutral-100 border-b-2 pb-2">
                <h3 className="font-semibold">Assets</h3>
              </div>
              <AssetsListView className="flex-1" />
              <div className="flex items-center justify-between border-t-2 pt-3">
                <span className="text-sm">Available Credit</span>
                <div className="flex items-center gap-x-1">
                  <Image
                    alt="USDC"
                    className="size-4"
                    src="https://ethereum-optimism.github.io/data/USDC/logo.png"
                    width={20}
                    height={20}
                  />
                  <span className="font-semibold">0.00</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-8 flex flex-col justify-center md:order-1 md:px-20">
            <div className="container max-w-screen-sm">
              <FormErc20Swap />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
