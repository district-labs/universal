import { DelegationToggle } from '@/components/delegations/delegations-toggle';
import { AccountSocialCredentialBadge } from '@/components/identity/account-social-credential-badge';
import { AccountAddress } from '@/components/onchain/account-address';
import { WalletPFP } from '@/components/onchain/wallet-pfp';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { SocialCredential } from 'universal-data';

import { useGetCreditLines } from 'universal-sdk';
import { TimeFromEpoch } from 'universal-wallet-ui';
import type { Address } from 'viem';
import { useChainId } from 'wagmi';

type ViewCreditLinesProps = React.HTMLAttributes<HTMLElement> & {
  delegate: Address | undefined;
};

export const ViewCreditLines = ({
  className,
  delegate,
}: ViewCreditLinesProps) => {
  const chainId = useChainId();
  const { data, isLoading } = useGetCreditLines({
    delegate,
    chainId,
  });

  if (isLoading || !data) {
    return <Skeleton className="h-72" />;
  }

  if (data.creditLines.length === 0) {
    return (
      <Card className="p-8 text-center">
        <h3 className="font-normal text-lg">No Active Credit Lines</h3>
      </Card>
    );
  }

  return (
    <div className={cn(className, 'grid grid-cols-1 gap-x-6 gap-y-5')}>
      {data.creditLines.map(({ data: delegation, metadata }) => (
        <div key={delegation.hash}>
          <Card
            className={cn(
              'relative z-20 flex flex-col items-center gap-x-10 gap-y-4 p-4 transition-shadow lg:flex-row lg:gap-x-20',
              {
                'shadow-md hover:shadow-lg': metadata.redemptions.length > 0,
              },
            )}
          >
            <CardContent className="flex flex-1 flex-col gap-x-10 gap-y-5 p-0 lg:flex-row lg:gap-x-20">
              <div className="flex flex-1 items-center gap-x-4">
                <div className="relative">
                  <img
                    src={metadata.token.logoURI}
                    alt={metadata.token.symbol}
                    className="-top-2 -left-2 absolute size-5 rounded-full border-[1px] border-white"
                  />
                  <WalletPFP
                    address={delegation.delegate}
                    className="size-8 rounded-full shadow-md"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-x-2">
                    <AccountAddress
                      className="font-bold text-base"
                      truncate={true}
                      address={delegation.delegate}
                    />
                    {/* <DelegationStatus className="text-xs" delegation={delegation} /> */}
                  </div>
                  <div className="flex items-center gap-x-3 text-sm">
                    <AccountSocialCredentialBadge
                      address={delegation.delegate}
                      credentials={
                        (data.credentials[delegation.delegate]
                          ?.credentials as SocialCredential[]) ||
                        ([] as SocialCredential[])
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-row items-center justify-center gap-x-8">
                <div className="flex flex-col items-center lg:items-end">
                  <span className="font-bold text-neutral-600 text-xl">
                    {metadata.limit.amountFormatted} {metadata.token.symbol}
                  </span>
                  <span className="text-sm">Total</span>
                </div>
                <div className="flex flex-col items-center lg:items-end">
                  <span className="font-black text-green-600 text-xl">
                    {metadata.available.amountFormatted} {metadata.token.symbol}
                  </span>
                  <span className="text-sm">Remaining</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex w-full flex-row items-center justify-center gap-x-4 p-0 lg:w-auto">
              <DelegationToggle delegation={delegation} className="w-full" />
            </CardFooter>
          </Card>
          {metadata.redemptions.length > 0 && (
            <Card
              key={delegation.hash}
              className="0 -top-2 relative z-10 rounded-t-none rounded-b-md px-4 pt-5 pb-2"
            >
              {metadata.redemptions.map((redemption) => (
                <div
                  key={redemption.transactionHash}
                  className="flex flex-row items-center justify-between px-4 py-3"
                >
                  <div className="flex flex-row items-center gap-x-1">
                    <img
                      src={metadata.token.logoURI}
                      alt={metadata.token.symbol}
                      className="size-5 rounded-full"
                    />
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-base">
                        {metadata.token.name}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-1 items-center justify-center">
                    <TimeFromEpoch epoch={Number(redemption.timestamp)} />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="">
                      <span className="font-bold text-red-500 text-xl">
                        -{redemption.redeemedFormatted} {metadata.token.symbol}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </Card>
          )}
        </div>
      ))}
    </div>
  );
};
