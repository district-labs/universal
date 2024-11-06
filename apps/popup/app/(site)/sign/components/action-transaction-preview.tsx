import { HTMLAttributes, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { FileWarning } from 'lucide-react';
import { useEstimateUserOpAssetChanges } from '@/lib/alchemy/hooks/use-simulate-user-op-asset-changes';
import { Skeleton } from '@/components/ui/skeleton';
import { useAccountState } from '@/lib/state/use-account-state';
import {
  AssetType,
  Change,
  simulateUserOpAssetChanges,
} from '@/lib/alchemy/actions/simulate-user-op-asset-changes';
import { Address } from 'viem';

type ActionTransactionPreview = HTMLAttributes<HTMLElement>;

export function ActionTransactionPreview({
  className,
}: ActionTransactionPreview) {
  const { accountState } = useAccountState();
  const { data, isLoading, isError, error } = useEstimateUserOpAssetChanges();

  console.log(error, isError, 'errorerror')

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
      </div>
    );
  }

  if (isLoading || !assets) {
    return <Skeleton className={cn('w-full h-5', className)} />;
  }

  const { erc20assets, erc1155assets, erc721assets } = assets;

  return (
    <div
      className={cn(
        'w-full py-4 border-neutral-200 bg-neutral-100 border-t-2 flex items-start flex-col gap-y-2',
        className,
      )}
    >
      <div className="text-sm px-4 pb-2 font-medium">
        Asset Changes (estimate)
      </div>
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
    <div className="px-5 flex w-full text-lg font-bold flex-col gap-y-0.5">
      {assets.map(
        ({ to, name, symbol, amount, assetType, contractAddress }) => {
          const equalAddress = isEqualAddress(to, smartContractAddress);
          return (
            <div
              key={contractAddress + amount}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-x-2">
                <Skeleton className="w-7 rounded-full h-7" />
                <h3>{name}</h3>
              </div>
              <div
                className={cn(equalAddress ? 'text-green-500' : 'text-red-500')}
              >
                {(equalAddress ? '+' : '-') +
                  ' ' +
                  (amount || '') +
                  ' ' +
                  (assetType === 'ERC20' ? symbol : '')}
              </div>
            </div>
          );
        },
      )}
    </div>
  );
