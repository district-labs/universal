'use client';
import { ConnectUniversalWalletButton } from '@/components/onchain/connect-universal-wallet';
import { IsWalletConnected } from '@/components/onchain/is-wallet-connected';
import { IsWalletDisconnected } from '@/components/onchain/is-wallet-disconnected';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { identityApiClient } from '@/lib/identity-api/client';
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
  const { signAndSaveDid } = useDidSign(identityApiClient);
  const { address, chainId } = useAccount();
  const { query } = useUniversalResolver({
    resolver: universalDeployments[chainId as number]?.resolver,
    address: address,
  });

  return (
    <>
      <section className="border-b-2 bg-neutral-100/30 py-6">
        <div className="container flex w-full flex-col items-center gap-2 md:flex-row md:justify-between">
          <h3 className="font-bold text-2xl ">Universal Document</h3>
          <p className="hidden md:block">
            Manage your universal identity document.
          </p>
        </div>
      </section>
      <section className="h-full max-w-[100vw] bg-neutral-100 px-6 py-6">
        <div className={cn('mx-auto')}>
          <div
            className={cn(
              'flex h-full w-full flex-col items-center justify-center',
            )}
          >
            <IsWalletDisconnected>
              <div className="flex items-center justify-center">
                <ConnectUniversalWalletButton
                  size="lg"
                  className="rounded-full py-3 text-lg"
                >
                  Connect Universal Wallet
                </ConnectUniversalWalletButton>
              </div>
            </IsWalletDisconnected>
            <IsWalletConnected>
              {query.data && query.isSuccess && (
                <div className="flex h-full w-full max-w-full flex-1 flex-col items-center justify-center overflow-auto text-sm">
                  <div className="container max-w-screen-lg">
                    <div className="mb-4 flex w-full flex-col items-center justify-between gap-2 md:flex-row">
                      <h3 className="font-bold text-xl">
                        <Image
                          className="size-10"
                          src="/images/qr-id-dark.png"
                          alt="qr-id-dark"
                          width={28}
                          height={28}
                        />
                      </h3>
                      <div className="flex items-center gap-y-3">
                        {query.data.status === 1 && (
                          <h3 className="font-normal text-sm">
                            Status: <span className="font-bold">Verified</span>
                          </h3>
                        )}

                        {query.data.status !== 1 && (
                          <Button
                            onClick={() => {
                              signAndSaveDid({
                                address: address as Address,
                                verifyingContract:
                                  universalDeployments[chainId as number]
                                    .resolver,
                                document: JSON.stringify(
                                  constructDidDocument({
                                    chainId: chainId as number,
                                    resolver:
                                      universalDeployments[chainId as number]
                                        .resolver,
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
                        <span>
                          {universalDeployments[chainId as number].resolver}
                        </span>
                        :<span>{address}</span>
                      </span>
                    </Card>
                    <Card className="mt-4 w-full p-5">
                      <h3 className="mb-2 font-bold text-lg">Document</h3>
                      <pre className="w-auto overflow-auto break-all pb-4 font-mono text-xs">{`${JSON.stringify(query.data.parsed, null, 2)}`}</pre>
                    </Card>
                  </div>
                </div>
              )}
            </IsWalletConnected>
          </div>
        </div>
      </section>
    </>
  );
}
