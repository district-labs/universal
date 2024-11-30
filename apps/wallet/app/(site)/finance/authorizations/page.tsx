'use client';
import {
  type FormData,
  FormErc20Authorize,
} from '@/components/forms/form-erc20-authorize';
import { useState } from 'react';
import { DebitCard } from 'universal-wallet-ui';
import type { Address } from 'viem';

export default function FinanceAuthorizationPage() {
  const [data, setData] = useState<FormData>();
  return (
    <div className="h-full">
      <section className="h-full">
        <div className="flex h-full w-full flex-col items-center lg:flex-row lg:justify-center ">
          <div className="order-1 flex w-full flex-col bg-neutral-100 py-6 lg:order-1 lg:h-full">
            <div className="container flex flex-1 flex-col items-center justify-center lg:px-14">
              <FormErc20Authorize onFormChange={setData} />
              <p className="mt-4 hidden text-center text-foreground-muted text-sm md:block">
                The recipient will be able to pull funds from your account at
                any time. <br /> You can revoke this authorization before
                spending occurs.
              </p>
            </div>
          </div>
          <div className="order-2 flex w-full flex-col py-6 lg:order-2 lg:h-full lg:border-l-2">
            <div className="flex flex-1 flex-col items-center justify-center px-4">
              <DebitCard
                amount={data?.amount || '0'}
                to={data?.to as Address}
                tokenAddress={data?.token?.address}
                symbol={data?.token?.symbol}
                name={data?.token?.name}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
