'use client';
import { IsWalletConnected } from '@/components/onchain/is-wallet-connected';
import { IsWalletDisconnected } from '@/components/onchain/is-wallet-disconnected';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { universalDeployments } from 'universal-data';
import {
  constructDidDocument,
  useDidSign,
  useUniversalResolver,
} from 'universal-identity-sdk';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';

export default function ViewDocument() {
  const { signAndSaveDid } = useDidSign();
  const { address, chainId } = useAccount();
  const { query } = useUniversalResolver({
    resolver: universalDeployments.Resolver,
    address: address,
  });

  return (
    <>
      <section className="h-full max-w-[100vw] bg-neutral-100 ">
        <div className={cn('mx-auto')}>
          <div
            className={cn(
              'flex h-full w-full flex-col items-center justify-center',
            )}
          >
            <IsWalletDisconnected>
              <div className="flex flex-col items-center justify-center gap-y-3 pt-6">
                Connect your wallet to view your credentials.
              </div>
            </IsWalletDisconnected>
            <IsWalletConnected>
              <>
                {query.data && query.isSuccess && (
                  <div className="flex h-full w-full max-w-full flex-1 flex-col items-center justify-center overflow-auto pt-6 text-sm">
                    <div className="container max-w-screen-lg">
                      <div className="mb-4 flex w-full flex-col items-center justify-between gap-2 md:flex-row">
                        <Image
                          className="size-8"
                          src="/images/qr-id-dark.png"
                          alt="qr-id-dark"
                          width={28}
                          height={28}
                        />
                        <div className="flex items-center gap-y-3">
                          {query.data.status === 1 && <Badge>Verified</Badge>}

                          {query.data.status !== 1 && (
                            <Button
                              onClick={() => {
                                signAndSaveDid({
                                  address: address as Address,
                                  verifyingContract:
                                    universalDeployments.Resolver,
                                  document: JSON.stringify(
                                    constructDidDocument({
                                      chainId: chainId as number,
                                      resolver: universalDeployments.Resolver,
                                      address: address as Address,
                                    }),
                                  ),
                                });
                              }}
                            >
                              Claim Universal Identity
                            </Button>
                          )}
                        </div>
                      </div>
                      <Card className="w-full p-5">
                        <h3 className="mb-2 font-bold text-lg">Identifier</h3>
                        <span className="mt-2 block break-all font-bold text-neutral-500">
                          dis:uis:
                          <span>{chainId}</span>:
                          <span>{universalDeployments.Resolver}</span>:
                          <span>{address}</span>
                        </span>
                      </Card>
                      <Card className="mt-4 w-full p-5">
                        <h3 className="mb-2 font-bold text-lg">Document</h3>
                        <pre className="w-auto overflow-auto break-all pb-4 font-mono text-xs">{`${JSON.stringify(query.data.parsed, null, 2)}`}</pre>
                      </Card>
                    </div>
                  </div>
                )}
              </>
            </IsWalletConnected>
          </div>
        </div>
      </section>
    </>
  );
}
