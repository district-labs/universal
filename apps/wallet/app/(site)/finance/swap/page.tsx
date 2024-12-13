'use client';
import { FormErc20Swap } from '@/components/forms/form-erc20-swap';
import { Badge } from '@/components/ui/badge';
import { AssetsListView } from '@/components/views/assets-list-view';
import { cn } from '@/lib/utils';
import { ArrowLeftFromLine, ArrowRightFromLine, Coins } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function FinanceSwapPage() {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <>
      <section className="flex h-full flex-col bg-gradient-to-br bg-neutral-100 from-neutral-50 to-stone-200">
        <div className="mx-auto grid h-full w-full gap-x-4 p-0 md:grid-cols-12">
          <div
            className={cn(
              'order-2 hidden space-y-2 bg-white px-2 py-2 shadow-md transition-shadow hover:shadow-xl md:order-1 md:block md:py-4',
              {
                'md:col-span-1 md:px-2.5': isMinimized,
                'col-span-1 md:col-span-3 md:px-4': !isMinimized,
              },
            )}
          >
            <div className="flex h-full w-full flex-col space-y-2">
              <div className="flex items-center justify-between border-neutral-100 border-b-2 pb-2">
                {isMinimized ? (
                  <Coins className="size-3 text-muted-foreground" />
                ) : (
                  <h3 className="font-semibold text-muted-foreground text-xs">
                    Assets
                  </h3>
                )}
                {isMinimized ? (
                  <Badge
                    variant={'outline'}
                    className="cursor-pointer transition-shadow hover:shadow-md"
                    onClick={() => setIsMinimized(false)}
                  >
                    <ArrowRightFromLine
                      className="size-3 cursor-pointer"
                      size={15}
                      onClick={() => setIsMinimized(false)}
                    />
                  </Badge>
                ) : (
                  <Badge
                    variant={'outline'}
                    className="cursor-pointer transition-shadow hover:shadow-md"
                    onClick={() => setIsMinimized(true)}
                  >
                    <ArrowLeftFromLine className="size-3" size={15} />
                  </Badge>
                )}
              </div>
              <AssetsListView className="flex-1" isMinimized={isMinimized} />
              <div
                className={cn(
                  'flex items-center justify-between border-t-2 pt-3',
                  {
                    'flex-col gap-y-1': isMinimized,
                    'flex-row': !isMinimized,
                  },
                )}
              >
                <span
                  className={cn({
                    'text-xs': isMinimized,
                    'text-sm': !isMinimized,
                  })}
                >
                  Credit
                </span>
                <div className="flex items-center gap-x-1">
                  <Image
                    alt="USDC"
                    className={cn({
                      'size-3': isMinimized,
                      'size-4': !isMinimized,
                    })}
                    src="https://ethereum-optimism.github.io/data/USDC/logo.png"
                    width={20}
                    height={20}
                  />
                  <span
                    className={cn('font-semibold', {
                      'text-xs': isMinimized,
                      'text-sm': !isMinimized,
                    })}
                  >
                    0.00
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            className={cn('flex flex-col justify-center md:order-2 md:px-20', {
              'md:col-span-11': isMinimized,
              'md:col-span-9': !isMinimized,
            })}
          >
            <div className="container max-w-screen-sm">
              <FormErc20Swap />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
