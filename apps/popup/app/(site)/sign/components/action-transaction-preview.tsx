import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useEstimateUserOpAssetChanges } from '@/lib/alchemy/hooks/use-simulate-user-op-asset-changes';
import { cn } from '@/lib/utils';
import { FileWarning, Info } from 'lucide-react';
import type { HTMLAttributes } from 'react';

import { IconLoading } from '@/components/icon-loading';
import type { Change } from '@/lib/alchemy/actions/simulate-user-op-asset-changes';
import { useAccountState } from '@/lib/state/use-account-state';
import type { Address, CallParameters } from 'viem';

type ActionTransactionPreview = HTMLAttributes<HTMLElement> & {
  calls: CallParameters[];
};

export function ActionTransactionPreview({
  className,
  calls,
}: ActionTransactionPreview) {
  const { accountState } = useAccountState();
  const {
    data: assets,
    isLoading,
    isError,
    error,
  } = useEstimateUserOpAssetChanges({
    calls,
  });

  if (isError) {
    return (
      <div
        className={cn(
          'flex w-full flex-col items-center justify-center border-neutral-200 border-t-2 bg-neutral-200/70 p-8 py-10',
          className,
        )}
      >
        <FileWarning size={32} className="mx-auto mb-4 text-red-600" />
        <h3 className="font-bold text-lg">Transaction Preview Unavailable</h3>
        <p className="txt-xs font-medium">
          Please make sure you trust this app.
        </p>
        {error?.name && <p className="">{error.name}</p>}
      </div>
    );
  }

  if (isLoading || !assets || !accountState) {
    return (
      <>
        <div
          className={cn(
            'flex h-5 w-full flex-1 items-center justify-center bg-neutral-100',
            className,
          )}
        >
          <IconLoading />
        </div>
      </>
    );
  }

  const { erc20assets, erc1155assets, erc721assets } = assets;

  if (
    erc20assets.length === 0 &&
    erc1155assets.length === 0 &&
    erc721assets.length === 0
  ) {
    return (
      <div
        className={cn(
          'flex w-full flex-col items-center justify-center border-neutral-200 border-t-2 bg-neutral-200/70 px-6 py-10',
          className,
        )}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="text-neutral-500" size={32} />
            </TooltipTrigger>
            <TooltipContent className="max-w-[350px] text-center">
              <p className="mb-2">
                The transaction was simulated to the best of our ability.{' '}
              </p>
              <p>You are responsible for all transaction confirmations.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <h3 className="mt-2 font-bold text-lg">No Estimated Asset Changes</h3>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex w-full flex-col items-start gap-y-2 border-neutral-200 border-t-2 bg-neutral-200/40 pb-2',
        className,
      )}
    >
      <div className="w-full flex-1">
        <div className="max-h-[220px] overflow-auto pt-4">
          <AssetList
            assets={erc20assets}
            smartContractAddress={accountState.smartContractAddress}
          />
          <AssetList
            assets={erc721assets}
            smartContractAddress={accountState.smartContractAddress}
          />
          <AssetList
            assets={erc1155assets}
            smartContractAddress={accountState.smartContractAddress}
          />
        </div>
      </div>
      <div className="flex w-full items-center justify-center gap-x-1 px-4 pb-0 text-center">
        <span className="font-medium text-sm">Estimated Asset Changes</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="text-neutral-600" size={16} />
            </TooltipTrigger>
            <TooltipContent className="mr-2 max-w-[350px] text-center">
              <p className="mb-2">
                The transaction was simulated to the best of our ability.{' '}
              </p>
              <p>You are responsible for all transaction confirmations.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

const isEqualAddress = (a: string, b: string) =>
  a.toLowerCase() === b.toLowerCase();

const AssetList = ({
  assets,
  smartContractAddress,
}: {
  assets: Change[];
  smartContractAddress: Address;
}) =>
  assets.length > 0 && (
    <div className="flex w-full flex-col gap-y-1.5 px-5 font-bold text-lg">
      {assets
        .filter(
          ({ to, from }) =>
            to.toLowerCase() === smartContractAddress.toLowerCase() ||
            from.toLowerCase() === smartContractAddress.toLowerCase(),
        )
        .reverse()
        .map(
          ({
            to,
            name,
            symbol,
            amount,
            assetType,
            contractAddress,
            changeType,
          }) => {
            const equalAddress = isEqualAddress(to, smartContractAddress);

            return (
              <div
                key={contractAddress + amount}
                className="flex items-center justify-between"
              >
                <span className="font-semibold text-base">{name}</span>
                <div className="flex flex-col items-end ">
                  <span
                    className={cn(
                      'text-base',
                      equalAddress ? 'text-emerald-600' : 'text-red-600',
                    )}
                  >
                    {`${equalAddress ? '+' : '-'} ${amount} ${assetType === 'ERC20' && symbol}`}
                  </span>
                  <span className="font-normal text-xs">{changeType}</span>
                </div>
              </div>
            );
          },
        )}
    </div>
  );
