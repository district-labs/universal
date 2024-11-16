'use client';
import { Card } from '@/components/ui/card';
import { Circle } from 'lucide-react';
import Image from 'next/image';
import { WALLET_SUPPORT } from './data';

export default function ViewOverview() {
  return (
    <>
      <section className="border-b-2 bg-neutral-100 py-6">
        <div className="container">
          <Card className="content mx-auto mb-5 grid w-full max-w-screen-lg p-4 lg:grid-cols-6">
            <div className="order-2 col-span-4 p-4 lg:order-1">
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
            <div className="order-1 col-span-2 flex items-center justify-center pl-4 lg:order-2 lg:border-l-2">
              <Image
                className="size-12 lg:size-32"
                src="/images/qr-id-dark.png"
                alt="qr-id-dark"
                width={128}
                height={128}
              />
            </div>
          </Card>

          <div className="mx-auto flex w-full max-w-screen-lg flex-col items-center justify-between gap-2 md:flex-row ">
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
      </section>
      <section>
        <div className="container mx-auto mt-10 mb-6 w-full">
          <>
            <div className="mt-4 grid gap-5 lg:grid-cols-3">
              <Card className="p-5">
                <Circle className="mb-4 text-emerald-400" size={32} />
                <h3 className="mb-2 font-bold text-lg">Managed by District</h3>
                <p className="text-xs">
                  Your decentralized identifier is hosted by District Labs but
                  always controlled by you.
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
                <h3 className="mb-2 font-bold text-lg">Controlled By You</h3>
                <p className="text-xs">
                  Only you can update your identifier by signing a message to
                  verify your identities authenticity.
                </p>
              </Card>
            </div>
            <div className="mt-4 grid gap-5 lg:grid-cols-4">
              <Card className="content col-span-2 p-8">
                {/* <Circle className='text-blue-400 mb-4' size={32} /> */}
                <h3 className="mb-2 font-bold text-3xl text-neutral-600">
                  How It Works
                </h3>
                <p>
                  Universal Identity System (UIS) is a modern, scalable, and
                  flexible approach to decentralized identity. As identity
                  becomes increasingly important in our world, UIS offers a path
                  towards a more decentralized and user-controlled digital
                  future.
                </p>

                <p>
                  Designed to scale, while also always giving users control:{' '}
                  <span className="font-bold">self-sovereignty</span>.
                </p>
              </Card>
              <Card className="content col-span-2 p-8">
                <h3 className="mb-2 font-bold text-3xl text-neutral-600">
                  Built for the Future
                </h3>
                <p>
                  UIS maintains the core principles of self-sovereign identity
                  while achieving scalability through trusted centralized
                  services.
                </p>

                <p>
                  By combining elements of did:web, did:pkh, and did:ethr, UIS
                  forms a modern DID standard capable of scaling to millions of
                  users.
                </p>
              </Card>
            </div>
          </>
        </div>
      </section>
    </>
  );
}
