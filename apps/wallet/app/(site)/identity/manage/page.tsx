'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { useAccount, usePublicClient } from 'wagmi';
import {
  constructDidDocument,
  constructDidIdentifier,
  resolveDid,
  useDidSign,
} from 'universal-identity-sdk';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QRCodeRender } from '@/components/qr-code-address';
import Image from 'next/image';
import { Circle } from 'lucide-react';

const WALLET_SUPPORT = [
  {
    name: 'MetaMask',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/2048px-MetaMask_Fox.svg.png',
  },
  {
    name: 'Universal Wallet',
    url: '/images/icon-sm.png',
  },
  {
    name: 'Coinbase Wallet',
    url: 'https://play-lh.googleusercontent.com/wrgUujbq5kbn4Wd4tzyhQnxOXkjiGqq39N4zBvCHmxpIiKcZw_Pb065KTWWlnoejsg',
  },
  {
    name: 'Rainbow Wallet',
    url: 'https://framerusercontent.com/images/Hml6PtJwt03gwFtTRYmbpo7EarY.png',
  },
  {
    name: 'Safe',
    url: 'https://images.ctfassets.net/1i5gc724wjeu/33tiPXJKVbMreBKcb6V2HH/71a5a520bd4e1a4626a2ce539be1313d/avatar-safe.png',
  },
  {
    name: 'Ledger',
    url: 'https://play-lh.googleusercontent.com/mHjR3KaAMw3RGA15-t8gXNAy_Onr4ZYUQ07Z9fG2vd51IXO5rd7wtdqEWbNMPTgdqrk',
  },
  {
    name: 'Rabby',
    url: 'https://avatars.githubusercontent.com/u/84845472?v=4',
  },
  {
    name: 'Zerion',
    url: 'https://pbs.twimg.com/profile_images/1639841598648512515/RXG5M-pv_400x400.jpg',
  },
];
export default function IdentityManagePage() {
  const { signAndSaveDid } = useDidSign();
  const client = usePublicClient();
  const { address } = useAccount();

  const [document, setDocument] = React.useState<{
    status: number;
    signature: string;
    data: string;
  }>();

  React.useEffect(() => {
    if (!client || !address) return;
    resolveDid(client, {
      resolver: '0x832C9b300de8a7fABeDA6A30AE498d623004CfcB',
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
  }, [client]);

  return (
    <section>
      <div className={cn('mx-auto')}>
        <div
          className={cn(
            'flex flex-col items-center justify-center w-full h-full',
          )}
        >
          <div className="mt-10 mb-6 w-full">
            <Card className="mb-5 p-4 max-w-screen-lg w-full mx-auto content grid grid-cols-6">
              <div className="col-span-4 p-4">
                <h3 className="font-bold text-3xl text-neutral-600 mb-2">
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
                      resolver: '0x832C9b300de8a7fABeDA6A30AE498d623004CfcB',
                      address: address,
                    })}
                  />
                )}
              </div>
            </Card>

            <div className="flex items-center gap-x-2 max-w-screen-lg w-full justify-between mx-auto ">
              <h3 className="font-bold text-lg">Supports All Wallet Types</h3>
              <div className="flex items-center gap-x-3">
                {WALLET_SUPPORT.map((wallet) => (
                  <Image
                    className="rounded-md shadow-lg p-0.5"
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
            <div className="h-full bg-neutral-100 flex-1 p-8 text-sm overflow-auto max-w-full w-full flex flex-col items-center justify-center">
              <div className="max-w-screen-lg w-full">
                <div className="w-full flex justify-between items-center mb-4">
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
                          verifyContract:
                            '0x832C9b300de8a7fABeDA6A30AE498d623004CfcB',
                          document: JSON.stringify(
                            constructDidDocument({
                              chainId: 85432,
                              resolver:
                                '0x832C9b300de8a7fABeDA6A30AE498d623004CfcB',
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
                <Card className="p-5 w-full">
                  <h3 className="font-bold text-lg mb-2">Identifier</h3>
                  <span className="font-bold block mt-2">
                    dis:uis:<span className="text-emerald-600">{'84532'}</span>:
                    <span className="text-blue-600">{address}</span>:
                    <span className="text-pink-600">
                      0x832C9b300de8a7fABeDA6A30AE498d623004CfcB
                    </span>
                  </span>
                </Card>
                <Card className="p-5 w-full mt-4">
                  <h3 className="font-bold text-lg mb-2">Document</h3>
                  <pre className="font-mono text-xs pb-4 w-auto">{`${JSON.stringify(document.data, null, 2)}`}</pre>
                </Card>
                <div className="grid grid-cols-3 gap-x-5 mt-4">
                  <Card className="p-5">
                    <Circle className="text-emerald-400 mb-4" size={32} />
                    <h3 className="font-bold text-lg mb-2">
                      Managed by District
                    </h3>
                    <p className="text-xs">
                      Your decentralized identifier is hosted by District Labs
                      but always controlled by you.
                    </p>
                  </Card>
                  <Card className="p-5">
                    <Circle className="text-blue-400 mb-4" size={32} />
                    <h3 className="font-bold text-lg mb-2">Secured by Base</h3>
                    <p className="text-xs">
                      Your identity is anchored to Base Sepolia. An Ethereum L2
                      managed by Coinbase.
                    </p>
                  </Card>
                  <Card className="p-5">
                    <Circle className="text-pink-400 mb-4" size={32} />
                    <h3 className="font-bold text-lg mb-2">
                      Controlled By You
                    </h3>
                    <p className="text-xs">
                      Only you can update your identifier by signing a message
                      to verify your identities authenticity.
                    </p>
                  </Card>
                </div>
                <div className="grid grid-cols-3 gap-x-5 mt-4">
                  <Card className="col-span-2 p-8 content">
                    {/* <Circle className='text-blue-400 mb-4' size={32} /> */}
                    <h3 className="font-bold text-3xl mb-2 text-neutral-600">
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
                  <Card className="p-5 flex items-center justify-center">
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
