import { cn } from '@/lib/utils';
import { ArrowDown } from 'lucide-react';
import Image from 'next/image';
import { useMemo } from 'react';
import { findToken, getDefaultTokenList } from 'universal-data';
import {
  decodeERC20BalanceGteWrapEnforcerTerms,
  decodeEnforcerERC20TransferAmount,
  getERC20BalanceGteWrapEnforcerFromDelegation,
  getErc20TransferAmountEnforcerFromDelegation,
} from 'universal-delegations-sdk';
import type { Delegation } from 'universal-types';
import { type Address, formatUnits } from 'viem';

export type ERC20SwapAuthorization = React.HTMLAttributes<HTMLElement> & {
  typedData: Delegation;
  chainId: number;
};

export const ERC20SwapAuthorization = ({
  className,
  typedData,
  chainId,
}: ERC20SwapAuthorization) => {
  const data = useMemo(() => {
    const { terms: erc20BalanceGteWrapEnforcerTerms } =
      getERC20BalanceGteWrapEnforcerFromDelegation(typedData);
    const { terms: erc20TransferAmountEnforceTerms } =
      getErc20TransferAmountEnforcerFromDelegation(typedData);
    const erc20TransferAmountEnforcerFormattedTerms =
      decodeEnforcerERC20TransferAmount(erc20TransferAmountEnforceTerms);
    const erc20BalanceGteWrapEnforcerFormattedTerms =
      decodeERC20BalanceGteWrapEnforcerTerms(erc20BalanceGteWrapEnforcerTerms);

    const addressOut = erc20TransferAmountEnforcerFormattedTerms[0] as Address;
    const addressIn = erc20BalanceGteWrapEnforcerFormattedTerms[0] as Address;
    const tokenList = getDefaultTokenList({ chainId });
    const tokenOut = findToken({ tokenList, address: addressOut });
    const tokenIn = findToken({ tokenList, address: addressIn });
    if (!tokenOut || !tokenIn) {
      throw new Error(`Token not found: ${addressIn}`);
    }
    return {
      to: typedData.delegate,
      amountOutFormatted: erc20TransferAmountEnforcerFormattedTerms[1],
      amountInFormatted: erc20BalanceGteWrapEnforcerFormattedTerms[1],
      tokenIn: tokenIn,
      tokenOut: tokenOut,
    };
  }, [typedData, chainId]);

  return (
    <div className={cn(className)}>
      <div className="flex flex-col justify-center gap-y-2 bg-neutral-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-1">
            <Image
              alt="Token Out"
              src={data.tokenOut.logoURI}
              className="size-8 rounded-full"
              width={20}
              height={20}
            />
            <div className="flex flex-col gap-y-0">
              <span className="font-bold text-lg text-primary/80">
                {data.tokenOut.symbol}
              </span>
              <span className="font-light text-muted-foreground text-xs">
                {data.tokenOut.name}
              </span>
            </div>
          </div>
          <span className="font-black text-2xl">
            {formatUnits(
              BigInt(data.amountOutFormatted),
              data.tokenOut.decimals,
            ).toString()}
          </span>
        </div>
        <ArrowDown className="ml-1.5 size-4 text-muted-foreground" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-1">
            <Image
              alt="Token In"
              src={data.tokenIn.logoURI}
              className="size-8 rounded-full"
              width={20}
              height={50}
            />
            <div className="flex flex-col gap-y-0">
              <span className="font-bold text-lg text-primary/80">
                {data.tokenIn.symbol}
              </span>
              <span className="font-light text-muted-foreground text-xs">
                {data.tokenIn.name}
              </span>
            </div>
          </div>
          <span className="font-black text-2xl">
            {formatUnits(
              BigInt(data.amountInFormatted),
              data.tokenIn.decimals,
            ).toString()}
          </span>
        </div>
      </div>
    </div>
  );
};
