'use client';
import { QRCodeRender } from '@/components/qr-code-address';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Circle } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { universalDeployments } from 'universal-data';
import {
  constructDidDocument,
  constructDidIdentifier,
  resolveDid,
  useDidSign,
} from 'universal-identity-sdk';
import { useAccount, usePublicClient } from 'wagmi';
import { WALLET_SUPPORT } from './data';

export default function IdentityManagePage() {
  const { signAndSaveDid } = useDidSign();
  const client = usePublicClient();
  const { address, chainId } = useAccount();

  const [document, setDocument] = useState<{
    status: number;
    signature: string;
    data: string;
  }>();

  useEffect(() => {
    if (!client || !address || !chainId) {
      return;
    }
    resolveDid(client, {
      resolver: universalDeployments[chainId as number].resolver,
      address: address,
    })
      .then((document) => {
        document.data = JSON.parse(document.data);
        setDocument(document);
        return;
      })
      .catch((error) => {
        console.error(error);
        return;
      });
  }, [client, address, chainId]);

  console.log(document, 'document');

  return (
    <section>
      <div className={cn('mx-auto')}>
        <div
          className={cn(
            'flex h-full w-full flex-col items-center justify-center',
          )}
        >
          <div className="mt-10 mb-6 w-full">
            <Card className="content mx-auto mb-5 grid w-full max-w-screen-lg grid-cols-6 p-4">
              <div className="col-span-4 p-4">
                <h3 className="mb-2 font-bold text-3xl text-neutral-600">
                  Universal Identity
                </h3>
                <p className="font-bold">Your wallet can be so much more.</p>
                <p>
                  It can be the source of your digital identity. An extension of
                  you across the web.
                </p>
                <p>
                  A place to store your data, your preferences, your history.{' '}
                  <span className="font-bold">A place to be you.</span>
                </p>
                <p>
                  Universal Identity bridges your onchain wallet to the rest of
                  the world.
                </p>
              </div>
              <div className="col-span-2 flex items-center justify-center border-l-2">
                {address && (
                  <QRCodeRender
                    size={200}
                    address={constructDidIdentifier({
                      chainId: 85432,
                      resolver: universalDeployments[chainId as number].resolver,
                      address: address,
                    })}
                  />
                )}
              </div>
            </Card>

            <div className="mx-auto flex w-full max-w-screen-lg items-center justify-between gap-x-2 ">
              <h3 className="font-bold text-lg">Supports All Wallet Types</h3>
              <div className="flex items-center gap-x-3">
                {WALLET_SUPPORT.map((wallet) => (
                  <Image
                    className="rounded-md p-0.5 shadow-lg"
                    key={wallet.name}
                    src={wallet.url}
                    alt={wallet.name}
                    width={32}
                    height={32}
                  />
                ))}
              </div>
            </div>
          </div>

          {document && address && (
            <div className="flex h-full w-full max-w-full flex-1 flex-col items-center justify-center overflow-auto bg-neutral-100 p-8 text-sm">
              <div className="w-full max-w-screen-lg">
                <div className="mb-4 flex w-full items-center justify-between">
                  <h3 className="font-bold text-xl">
                    Claim Your Universal Identity
                  </h3>
                  <div className="flex items-center gap-x-4">
                    <h3 className="font-normal text-sm">
                      Status:{' '}
                      <span className="font-bold">
                        {document.status === 1 ? 'Verified' : 'Unverified'}
                      </span>
                    </h3>
                    <Button
                      onClick={() => {
                        signAndSaveDid({
                          address,
                          verifyContract:
                            universalDeployments[chainId as number].resolver,
                          document: JSON.stringify(
                            constructDidDocument({
                              chainId: chainId as number,
                              resolver:
                                universalDeployments[chainId as number]
                                  .resolver,
                              address: address,
                            }),
                          ),
                        });
                      }}
                    >
                      Claim Now
                    </Button>
                  </div>
                </div>
                <Card className="w-full p-5">
                  <h3 className="mb-2 font-bold text-lg">Identifier</h3>
                  <span className="mt-2 block font-bold">
                    dis:uis:<span className="text-blue-600">{'84532'}</span>:
                    <span className="text-emerald-600">
                      {universalDeployments[chainId as number]
                                  .resolver}
                    </span>
                    :<span className="text-blue-600">{address}</span>
                  </span>
                </Card>
                <Card className="mt-4 w-full p-5">
                  <h3 className="mb-2 font-bold text-lg">Document</h3>
                  <pre className="w-auto pb-4 font-mono text-xs">{`${JSON.stringify(document.data, null, 2)}`}</pre>
                </Card>
                <div className="mt-4 grid grid-cols-3 gap-x-5">
                  <Card className="p-5">
                    <Circle className="mb-4 text-emerald-400" size={32} />
                    <h3 className="mb-2 font-bold text-lg">
                      Managed by District
                    </h3>
                    <p className="text-xs">
                      Your decentralized identifier is hosted by District Labs
                      but always controlled by you.
                    </p>
                  </Card>
                  <Card className="p-5">
                    <Circle className="mb-4 text-blue-400" size={32} />
                    <h3 className="mb-2 font-bold text-lg">Secured by Base</h3>
                    <p className="text-xs">
                      Your identity is anchored to Base Sepolia. An Ethereum L2
                      managed by Coinbase.
                    </p>
                  </Card>
                  <Card className="p-5">
                    <Circle className="mb-4 text-pink-400" size={32} />
                    <h3 className="mb-2 font-bold text-lg">
                      Controlled By You
                    </h3>
                    <p className="text-xs">
                      Only you can update your identifier by signing a message
                      to verify your identities authenticity.
                    </p>
                  </Card>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-x-5">
                  <Card className="content col-span-2 p-8">
                    {/* <Circle className='text-blue-400 mb-4' size={32} /> */}
                    <h3 className="mb-2 font-bold text-3xl text-neutral-600">
                      How It Works
                    </h3>
                    <p className="">
                      Universal Identity System (UIS) is a modern, scalable, and
                      flexible approach to decentralized identity. As identity
                      becomes increasingly important in our world, UIS offers a
                      path towards a more decentralized and user-controlled
                      digital future.
                    </p>

                    <p className="">
                      Designed to scale, while also always giving users control:{' '}
                      <span className="font-bold">self-sovereignty</span>.
                    </p>
                  </Card>
                  <Card className="flex items-center justify-center p-5">
                    <Image
                      src="/images/qr-id-dark.png"
                      alt="qr-id-dark"
                      width={80}
                      height={80}
                    />
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
