'use client';
import Image from 'next/image';
import { ConnectButton } from '@/components/onchain/connect-button';
import { IsWalletConnected } from '@/components/onchain/is-wallet-connected';
import { IsWalletDisconnected } from '@/components/onchain/is-wallet-disconnected';
import { Card, CardContent } from '@/components/ui/card';
import { LinkComponent } from '@/components/ui/link-component';

export default function HomePage() {
  return (
    <>
      <div className="w-full px-4">
        <div className="mt-4 flex flex-col gap-y-4">
          <Card className="relative overflow-hidden p-0">
            <CardContent className="flex flex-col md:flex-row gap-y-5 p-0 default:mb-0 default:flex-col md:mb-0">
              <div className="order-1 md:order-2 flex items-center gap-x-4 p-8 text-center md:w-1/2 md:p-20 md:text-left">
                <div className="flex flex-col gap-y-5 justify-center items-center w-full">
                  <div className="text-center md:text-center">
                    <h3 className="text-4xl font-black text-emerald-500 dark:text-emerald-400 md:text-5xl">
                      Universal Wallet
                    </h3>
                    <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 md:text-3xl">
                      Discover What's Possible
                    </h3>
                  </div>
                </div>
              </div>
              <div className="relative z-10 order-1 flex flex-1 items-center justify-center bg-white px-8 py-16 dark:bg-neutral-900 md:order-2 md:w-1/2 md:border-l-2 md:py-8 h-auto border-t-2 md:border-t-0">
                <div className="absolute inset-0 z-0">
                  <Image
                    src="/images/landing/universal-circles.png"
                    alt="Hero"
                    className="size-full object-cover"
                    width={800}
                    height={800}
                  />
                </div>
                <div className="relative z-50 text-center">
                  <IsWalletDisconnected>
                    <ConnectButton size="lg" rounded={'full'}>
                      Connect Wallet
                    </ConnectButton>
                  </IsWalletDisconnected>
                  <IsWalletConnected>
                    <span className="font-bold">Build. Create. Explore.</span>
                  </IsWalletConnected>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="mt-6 p-4 max-w-screen-sm w-full mx-auto content">
            <p className="font-bold">
              Universal is a place to discover what's possible.
            </p>
            <p>
              To push the boundaries, innovate, and create.{' '}
              <span className="font-bold">To build the future.</span>
            </p>
            <p>
              Our efforts are entirely focused around the intersection of smart
              wallets, identity, permission, authorizations, and making the
              onchain user experience great.
            </p>
            <p>
              The Universal stack is in early development, but we encourage you
              to explore and experiment with what's available.
            </p>
            <p>
              <span className='font-bold'>Everything is Open Source.</span> With a MIT license wherever possible.
            </p>
            <ul className="list-disc list-inside pl-4 mb-4">
              <li>
                <LinkComponent href="https://github.com/district-labs/universal-sdk">
                  Universal SDK
                </LinkComponent>
              </li>
              <li>
                <LinkComponent href="https://github.com/district-labs/universal-smart-wallet">
                  Universal Smart Wallet
                </LinkComponent>
              </li>
              <li>
                <LinkComponent href="https://github.com/district-labs/universal-identity">
                  Universal Identity
                </LinkComponent>
              </li>
            </ul>
            <p className=''>
              Send use a {' '}
              <LinkComponent href="https://x.com/KamesGeraghty">
                message on X
              </LinkComponent>{' '}
              to learn more, contribute and get involved.
            </p>
            <p className=''>
              <p className=''>
                The Universal Wallet uses the <LinkComponent href="https://github.com/MetaMask/delegation-framework">
                MetaMask Delegation Framework
              </LinkComponent>  for advanced onchain authorizations and permissions.
                We highly recommend reviewing those smart contracts to understand the full potential of Universal.
              </p>
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
