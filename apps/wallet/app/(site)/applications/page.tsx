'use client';
import { CameraQrScanner } from '@/components/camera/camera-qr-scanner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import { LinkComponent } from '@/components/ui/link-component';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  ArrowLeftRight,
  CircleDollarSign,
  ExternalLink,
  Globe,
  MessageCircleHeart,
  ScanQrCode,
} from 'lucide-react';
import Image from 'next/image';

export default function LeaderboardPage() {
  return (
    <div className="relative">
      <div className="h-full pb-10">
        <Tabs defaultValue="swap" className=" flex h-full w-full flex-col p-0">
          <section className="border-b-2 bg-neutral-100/30 py-3">
            <div className="container flex w-full flex-row items-center justify-between gap-2 md:flex-row">
              <h1 className="font-semibold text-lg lg:text-xl">Applications</h1>
              <div className="flex flex-1 items-center justify-end gap-x-6">
                <TabsList className="max-w-screen-sm">
                  <TabsTrigger value="swap">
                    <ArrowLeftRight className="mr-1 size-4" />
                    <span className="hidden md:inline">Swap</span>
                  </TabsTrigger>
                  <TabsTrigger value="earn">
                    <CircleDollarSign className="mr-1 size-4" />
                    <span className="hidden md:inline">Earn</span>
                  </TabsTrigger>
                  <TabsTrigger value="collect">
                    <MessageCircleHeart className="mr-1 size-4" />
                    <span className="hidden md:inline">Collect</span>
                  </TabsTrigger>
                  <TabsTrigger value="all">
                    <Globe className="mr-1 size-4" />
                    <span className="hidden md:inline">All</span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
          </section>
          <div className="mt-6 flex-1 space-y-6 lg:h-auto">
            <div className="container">
              <Card className="flex flex-col items-center gap-y-1 p-5 lg:flex-row lg:p-8">
                <div className="flex flex-col items-center gap-x-4 lg:w-8/12 lg:flex-row">
                  <img
                    src="https://1000logos.net/wp-content/uploads/2022/05/WalletConnect-Logo.jpg"
                    alt="WalletConnect"
                    className="h-auto w-10 lg:w-14"
                  />
                  <div className="">
                    <h3 className="font-bold text-xl">
                      Connect. Anywhere. Instantly.
                    </h3>
                    <span className="hidden text-sm lg:inline-block">
                      Scan the QR code on{' '}
                      <span className="font-bold">mobile</span> or paste a link
                      on <span className="font-bold">desktop</span> to get
                      connected.
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-x-2 lg:w-5/12 lg:flex-row lg:justify-end">
                  <span className="flex items-center gap-x-1 text-right text-sm">
                    Click the scan{' '}
                    <span className="flex items-center text-blue-500 lg:hidden">
                      <ScanQrCode className="size-5 text-lg" />
                    </span>{' '}
                    icon in <br className="hidden lg:inline" />
                    the top right to get started
                  </span>
                  <CameraQrScanner
                    isWalletConnectEnabled={true}
                    className="hidden lg:flex"
                  />
                </div>
              </Card>
            </div>
            <TabsContent value="all" className="m-0 p-0">
              <section>
                <div className="container grid max-w-[100vw] gap-8 md:max-w-[1400px] lg:grid-cols-3">
                  {APPLICATIONS.map((application) => (
                    <ApplicationCard key={application.name} {...application} />
                  ))}
                </div>
              </section>
            </TabsContent>
            <TabsContent value="swap" className="m-0 p-0">
              <section>
                <div className="container grid max-w-[100vw] gap-8 md:max-w-[1400px] lg:grid-cols-3">
                  {APPLICATIONS.filter((application) =>
                    application.tags.includes('swap'),
                  ).map((application) => (
                    <ApplicationCard key={application.name} {...application} />
                  ))}
                </div>
              </section>
            </TabsContent>
            <TabsContent value="collect" className="m-0 p-0">
              <section>
                <div className="container grid max-w-[100vw] gap-8 md:max-w-[1400px] lg:grid-cols-3">
                  {APPLICATIONS.filter((application) =>
                    application.tags.includes('collect'),
                  ).map((application) => (
                    <ApplicationCard key={application.name} {...application} />
                  ))}
                </div>
              </section>
            </TabsContent>
            <TabsContent value="earn" className="m-0 p-0">
              <section>
                <div className="container grid max-w-[100vw] gap-8 md:max-w-[1400px] lg:grid-cols-3">
                  {APPLICATIONS.filter((application) =>
                    application.tags.includes('earn'),
                  ).map((application) => (
                    <ApplicationCard key={application.name} {...application} />
                  ))}
                </div>
              </section>
            </TabsContent>
            <div className="container lg:pt-0">
              <Card className="grid grid-cols-12 gap-y-1 p-0 lg:flex-row">
                <div className="col-span-12 flex flex-col items-center justify-center gap-x-4 p-16 py-20 lg:col-span-6 lg:flex-row">
                  <div className="content text-center md:text-left">
                    <span className="font-normal text-lg lg:text-2xl">
                      Install on a Smartphone in Seconds
                    </span>
                    {/* <h3 className="font-bold text-5xl">A Wallet For <span className='italic'>On-The-Go</span></h3> */}
                    <h3 className="font-bold text-4xl lg:text-5xl">
                      Universal Wallet
                    </h3>
                    <p className="mt-4">
                      Bring your Universal wallet with you wherever you go.
                      Install the app on your phone and access your wallet in
                      seconds.{' '}
                      <span className="font-bold">
                        Simple, secure, and easy to use.
                      </span>
                    </p>
                    <div className="flex flex-col items-center gap--2 py-2 md:flex-row">
                      <div className="flex items-center gap-x-2">
                        <Image
                          height={20}
                          width={20}
                          src="/images/platforms/android.png"
                          alt="Anrdoid Smartphone"
                          className="size-7"
                        />
                        <Image
                          height={20}
                          width={20}
                          src="/images/platforms/ios.webp"
                          alt="iOS Smartphone"
                          className="size-7"
                        />
                      </div>
                      <span className="text-sm">
                        Click the <span className="font-bold">Share</span>{' '}
                        button and{' '}
                        <span className="font-bold">Add to Home</span>.{' '}
                        <br className="md:hidden" />
                        <span className="italic">It's that easy!</span>
                      </span>
                    </div>
                    <p className="mt-4">
                      <span className="font-medium text-xs">
                        {' '}
                        Universal is a Progressive Web App (PWA) with no app
                        store downloads required.
                      </span>
                    </p>
                  </div>
                </div>
                <div className="relative hidden flex-col items-center gap-x-2 overflow-hidden border-l-2 bg-neutral-100 shadow-inner lg:col-span-6 lg:flex lg:flex-row lg:justify-end">
                  <div className="absolute top-0 right-0 bottom-0 left-0 z-50 flex justify-center">
                    <img
                      alt="Universal Wallet"
                      className="object-cover"
                      src="/images/multi-iphone-app-preview.png"
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

const APPLICATIONS = [
  {
    name: 'Uniswap',
    logoURI: 'https://d392zik6ho62y0.cloudfront.net/images/uniswap-logo.png',
    description: 'Swap tokens and earn fees through pooled market making',
    tags: ['swap'],
    href: 'https://app.uniswap.org/',
  },
  {
    name: 'Aerodrome',
    logoURI: 'https://d392zik6ho62y0.cloudfront.net/images/aerodrome-logo.png',
    description: 'Central trading & liquidity marketplace on Base',
    tags: ['swap'],
    href: 'https://app.uniswap.org/',
  },
  {
    name: 'Matcha',
    logoURI: 'https://d392zik6ho62y0.cloudfront.net/images/matcha-logo.png',
    description: 'DEX Aggregator by 0x',
    tags: ['swap'],
    href: 'https://matcha.xyz/',
  },
  {
    name: 'PoolTogether',
    logoURI:
      'https://d392zik6ho62y0.cloudfront.net/images/pooltogether-logo.png',
    description: 'Deposit tokens to win prizes in a no-loss lottery',
    tags: ['earn'],
    href: 'https://app.cabana.fi/',
  },
  {
    name: 'Morpho',
    logoURI: 'https://d392zik6ho62y0.cloudfront.net/images/morpho-logo.png',
    description: 'Borrow and lend assets with fixed rates',
    tags: ['earn'],
    href: 'https://app.morpho.org/?network=base',
  },
  {
    name: 'Fluid',
    logoURI: 'https://d392zik6ho62y0.cloudfront.net/images/fluid-logo.png',
    description: 'Lending & Borrowing protocol',
    tags: ['earn'],
    href: 'https://fluid.instadapp.io/',
  },
  {
    name: 'Compound',
    logoURI: 'https://d392zik6ho62y0.cloudfront.net/images/compound-logo.png',
    description: 'Lend and borrow crypto assets',
    tags: ['earn'],
    href: 'https://app.compound.finance/?market=usdc-mainnet',
  },
  {
    name: 'Moonwell',
    logoURI: 'https://d392zik6ho62y0.cloudfront.net/images/moonwell-logo.png',
    description: 'Lending made simple',
    tags: ['earn'],
    href: 'https://moonwell.fi/',
  },
  {
    name: 'OpenSea',
    logoURI: 'https://d392zik6ho62y0.cloudfront.net/images/opensea-logo.png',
    description: 'Discover and collect NFTs',
    tags: ['collect'],
    href: 'https://opensea.io/',
  },
  {
    name: 'Zora',
    logoURI: 'https://d392zik6ho62y0.cloudfront.net/images/zora-logo.png',
    description: 'Buy, sell, and curate NFTs',
    tags: ['collect'],
    href: 'https://opensea.io/',
  },
  {
    name: 'Magic Eden',
    logoURI: 'https://d392zik6ho62y0.cloudfront.net/images/magic-eden-logo.png',
    description: 'Discover and collect NFTs',
    tags: ['collect'],
    href: 'https://magiceden.us/',
  },
];

const selectVariant = (tag: string) =>
  tag === 'swap'
    ? 'green'
    : tag === 'earn'
      ? 'blue'
      : tag === 'orange'
        ? 'destructive'
        : ('default' as const);

type ApplicationCard = React.HTMLAttributes<HTMLElement> & {
  name: string;
  logoURI: string;
  description: string;
  tags: string[];
  href: string;
};

const ApplicationCard = ({
  className,
  name,
  logoURI,
  description,
  href,
  tags,
}: ApplicationCard) => {
  return (
    <Card className={cn('transition-shadow hover:shadow-lg', className)}>
      <CardHeader>
        <Image
          className="size-14 rounded-2xl border-2 border-white shadow-sm"
          src={logoURI}
          alt={name}
          width={48}
          height={48}
        />
        <h2 className="font-bold text-2xl">{name}</h2>
        <p className="text-xs">{description}</p>
      </CardHeader>
      <CardFooter className="flex flex-row justify-between border-t-2 pt-4 pb-4">
        <LinkComponent href={href}>
          <Button rounded="full" size="sm" className="px-4">
            Open App <ExternalLink
              className="size-"
              width={5}
              height={5}
            />{' '}
          </Button>
        </LinkComponent>
        <div className="flex flex-1 items-center justify-end space-x-1">
          {tags.map((tag) => (
            <Badge
              variant={selectVariant(tag)}
              className="rounded-full"
              key={tag}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};
