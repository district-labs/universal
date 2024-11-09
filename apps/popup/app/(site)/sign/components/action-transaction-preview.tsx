import { HTMLAttributes, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { FileWarning, Info } from 'lucide-react';
import { useEstimateUserOpAssetChanges } from '@/lib/alchemy/hooks/use-simulate-user-op-asset-changes';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { useAccountState } from '@/lib/state/use-account-state';
import {
  AssetType,
  Change,
} from '@/lib/alchemy/actions/simulate-user-op-asset-changes';
import { Address } from 'viem';
import { IconLoading } from '@/components/icon-loading';

type ActionTransactionPreview = HTMLAttributes<HTMLElement>;

export function ActionTransactionPreview({
  className,
}: ActionTransactionPreview) {
  const { accountState } = useAccountState();
  const { data, isLoading, isError, error } = useEstimateUserOpAssetChanges();

  const assets = useMemo(() => {
    if (!data) return null;

    const filterAssetsByType = (type: AssetType) =>
      data.filter(({ assetType }) => assetType === type);

    return {
      erc721assets: filterAssetsByType('ERC721'),
      erc1155assets: filterAssetsByType('ERC1155'),
      erc20assets: filterAssetsByType('ERC20'),
    };
  }, [data]);

  if (isError) {
    return (
      <div
        className={cn(
          'w-full p-8 py-10 border-neutral-200 bg-neutral-100 border-t-2 flex items-center justify-center flex-col',
          className,
        )}
      >
        <FileWarning size={32} className="text-red-600 mx-auto mb-4" />
        <h3 className="font-bold text-lg">Transaction Preview Unavailable</h3>
        <p className="txt-xs font-medium">
          Please make sure you trust this app.
        </p>
        {error?.name && <p className="">{error.name}</p>}
      </div>
    );
  }

  if (isLoading || !assets) {
    return (
      <>
        <div
          className={cn(
            'bg-neutral-100 w-full h-5 flex-1 flex items-center justify-center',
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
          'w-full px-6 py-10 border-neutral-200 bg-neutral-100 border-t-2 flex items-center justify-center flex-col',
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
        <h3 className="font-bold text-lg mt-2">No Estimated Asset Changes</h3>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'w-full pb-2 border-neutral-200 bg-neutral-100 border-t-2 flex items-start flex-col gap-y-2',
        className,
      )}
    >
      <div className="flex-1 w-full">
        <div className="max-h-[220px] overflow-auto pt-4">
          <AssetList
            assets={erc20assets}
            smartContractAddress={accountState!.smartContractAddress}
          />
          <AssetList
            assets={erc721assets}
            smartContractAddress={accountState!.smartContractAddress}
          />
          <AssetList
            assets={erc1155assets}
            smartContractAddress={accountState!.smartContractAddress}
          />
        </div>
      </div>
      <div className="px-4 pb-0 text-center w-full flex items-center gap-x-1 justify-center">
        <span className="text-sm font-medium">Estimated Asset Changes</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="text-neutral-600" size={16} />
            </TooltipTrigger>
            <TooltipContent className="max-w-[350px] text-center mr-2">
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
    <div className="px-5 flex w-full text-lg font-bold flex-col gap-y-1.5">
      {assets.map(
        ({ to, name, symbol, amount, assetType, contractAddress }) => {
          const equalAddress = isEqualAddress(to, smartContractAddress);

          return (
            <div
              key={contractAddress + amount}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-x-2">
                <h3 className="font-semibold text-sm">{name}</h3>
              </div>
              <span
                className={cn(
                  'text-base',
                  equalAddress ? 'text-green-500' : 'text-red-500',
                )}
              >
                {(equalAddress ? '+' : '-') +
                  ' ' +
                  (amount || '') +
                  ' ' +
                  (assetType === 'ERC20' ? symbol : '')}
              </span>
            </div>
          );
        },
      )}
    </div>
  );
