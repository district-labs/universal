// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React, { useEffect, useRef, useState } from 'react';
import { type Address as AddressType, zeroAddress } from 'viem';
import { Address } from '../onchain/address';
import { Card } from '../ui/card';
import { cn, formatNumber } from '../utils';

interface DebitCardProps {
  to: AddressType;
  amount?: string;
  tokenAddress?: string;
  chainId?: number;
  symbol?: string;
  name?: string;
  color?: 'default' | 'blue' | 'green' | 'red' | 'yellow';
}

export function DebitCard({
  to = zeroAddress,
  amount = '0',
  name = 'Ethereum',
  symbol = 'ETH',
  color = 'default',
}: DebitCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);

  // Measure the component's width
  useEffect(() => {
    const handleResize = () => {
      if (cardRef.current) {
        setWidth(cardRef.current.offsetWidth);
      }
    };

    handleResize(); // Initial measurement

    const observer = new ResizeObserver(() => {
      handleResize();
    });

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  // Define font size classes based on width ranges
  const getFontSizeClass = (
    size: 'small' | 'normal' | 'medium' | 'large' | 'xLarge' | 'xxLarge',
  ) => {
    if (width >= 500) {
      switch (size) {
        case 'small':
          return 'text-base leading-tight';
        case 'normal':
          return 'text-lg leading-tight';
        case 'medium':
          return 'text-xl leading-tight';
        case 'large':
          return 'text-2xl leading-tight';
        case 'xLarge':
          return 'text-4xl leading-tight';
        case 'xxLarge':
          return 'text-6xl leading-tight';
        default:
          return '';
      }
    }
    if (width >= 400) {
      switch (size) {
        case 'small':
          return 'text-sm leading-tight';
        case 'normal':
          return 'text-base leading-tight';
        case 'medium':
          return 'text-lg leading-tight';
        case 'large':
          return 'text-xl leading-tight';
        case 'xLarge':
          return 'text-3xl leading-tight';
        case 'xxLarge':
          return 'text-5xl leading-tight';
        default:
          return '';
      }
    }
    // width < 400
    switch (size) {
      case 'small':
        return 'text-xs leading-tight';
      case 'normal':
        return 'text-sm leading-tight';
      case 'medium':
        return 'text-base leading-tight';
      case 'large':
        return 'text-lg leading-tight';
      case 'xLarge':
        return 'text-2xl leading-tight';
      case 'xxLarge':
        return 'text-4xl leading-tight';
      default:
        return '';
    }
  };

  return (
    <Card
      ref={cardRef}
      className={cn(
        {
          'from-blue-500 to-blue-600': color === 'blue',
          'from-green-500 to-green-600': color === 'green',
          'from-red-500 to-red-600': color === 'red',
          'from-yellow-500 to-yellow-600': color === 'yellow',
          'from-neutral-500 to-neutral-600': color === 'default',
        },
        'relative aspect-[36/22] w-full min-w-[320px] max-w-[560px] overflow-hidden rounded-2xl border-0 border-2 border-neutral-100 bg-gradient-to-br text-white shadow-md',
      )}
    >
      <div className="-translate-y-1/3 absolute top-0 right-0 h-4/6 w-3/5 translate-x-1/3 rounded-full bg-white/20" />
      <div className="relative flex h-full flex-col justify-between px-6 pt-2 pb-4">
        <div className="flex items-start justify-between ">
          <div className="space-y-1 pt-4">
            <div className={cn('font-medium', getFontSizeClass('small'))}>
              Credit Authorization
            </div>
            {to && (
              <div className={cn('font-bold', getFontSizeClass('medium'))}>
                <Address truncate={true} address={to} />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className={cn('font-bold', getFontSizeClass('xxLarge'))}>
                {symbol}
              </div>
              <div className={cn('opacity-80', getFontSizeClass('small'))}>
                {name}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pb-2">
          <div>
            <div
              className={cn(
                'font-medium opacity-80',
                getFontSizeClass('normal'),
              )}
            >
              Total
            </div>
            <div className="flex items-center">
              <span className={cn('font-bold', getFontSizeClass('xLarge'))}>
                {formatNumber(amount)}
              </span>
              <span
                className={cn('ml-1 font-medium', getFontSizeClass('medium'))}
              >
                {symbol}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
