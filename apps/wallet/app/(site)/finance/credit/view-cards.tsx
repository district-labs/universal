import { AccountSocialCredentialBadge } from '@/components/identity/account-social-credential-badge';
import { AccountAddress } from '@/components/onchain/account-address';
import { IsNotUniversalWallet } from '@/components/onchain/is-not-universal-wallet';
import { IsUniversalWallet } from '@/components/onchain/is-universal-wallet';
import { WalletPFP } from '@/components/onchain/wallet-pfp';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Ban, KeySquare } from 'lucide-react';
import type { SocialCredential } from 'universal-data';
import { useDelegationExecute } from 'universal-delegations-sdk';

import { useGetCreditLines } from 'universal-sdk';
import { TimeFromEpoch } from 'universal-wallet-ui';
import { type Address, encodeFunctionData, erc20Abi } from 'viem';
import { useAccount, useChainId } from 'wagmi';

type ViewCreditCardsProps = React.HTMLAttributes<HTMLElement> & {
  delegate: Address | undefined;
};

export const ViewCreditCards = ({
  className,
  delegate,
}: ViewCreditCardsProps) => {
  const { address } = useAccount();
  const chainId = useChainId();
  const execute = useDelegationExecute();
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
            <CardContent
              className={cn(
                'flex flex-1 flex-col gap-x-10 gap-y-5 p-0 transition-opacity lg:flex-row lg:gap-x-20',
                {
                  'opacity-50 hover:opacity-90': delegation.isRevoked,
                },
              )}
            >
              <div className="flex items-center gap-x-4">
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
              <div className="flex flex-row items-center justify-center gap-x-12">
                <div className="flex flex-col items-center lg:items-start">
                  <span className="font-black text-3xl">
                    {metadata.available.amountFormatted} {metadata.token.symbol}
                  </span>
                  <span className="text-sm">Remaining</span>
                </div>
                <div className="flex flex-col items-center lg:items-start">
                  <span className="font-bold text-neutral-600 text-xl">
                    {metadata.limit.amountFormatted} {metadata.token.symbol}
                  </span>
                  <span className="text-sm">Total</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex w-full flex-row items-center justify-center gap-x-4 p-0 lg:w-auto">
              {delegation.isRevoked ? (
                <Button variant={'destructive'} rounded={'full'}>
                  Revoked
                  <Ban className="ml-0 size-2" />
                </Button>
              ) : (
                <div className="space-x-3">
                  <IsUniversalWallet>
                    <Button variant={'emerald'} rounded={'full'}>
                      Delegate <span className="text-xs">(Coming Soon)</span>
                      <KeySquare className="ml-0 size-2" />
                    </Button>
                  </IsUniversalWallet>
                  <IsNotUniversalWallet>
                    <Button
                      className="w-full"
                      rounded={'full'}
                      variant={'emerald'}
                      onClick={() => {
                        execute({
                          delegationManager: delegation.verifyingContract,
                          delegation: delegation,
                          executions: {
                            target: metadata.token.address as Address,
                            calldata: encodeFunctionData({
                              abi: erc20Abi,
                              functionName: 'transfer',
                              args: [
                                address as Address,
                                BigInt(metadata.available.amount),
                              ],
                            }),
                            value: BigInt(0),
                          },
                        });
                      }}
                    >
                      Claim
                    </Button>
                  </IsNotUniversalWallet>
                </div>
              )}
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
