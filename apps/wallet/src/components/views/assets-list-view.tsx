import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type * as React from 'react';

import { defaultTokenList } from '@/lib/chains';
import Image from 'next/image';
import type { TokenItem } from 'universal-types';
import type { Address } from 'viem';
import { ERC20Balance } from '../onchain/erc20-balance';
import { ExplorerAddressLink } from '../onchain/etherscan-address-link';
import { LinkComponent } from '../ui/link-component';

type AssetsListView = React.HTMLAttributes<HTMLElement>;

const AssetsListView = ({ className }: AssetsListView) => {
  return (
    <div className={cn('space-y-0', className)}>
      {defaultTokenList.tokens.map((token) => {
        return <AssetCard token={token} key={token.address} />;
      })}
    </div>
  );
};

export { AssetsListView };

type AssetCard = React.HTMLAttributes<HTMLElement> & {
  token: TokenItem;
};

const AssetCard = ({ className, token }: AssetCard) => {
  return (
    <Dialog>
      <DialogTrigger asChild={true}>
        <div
          className={cn(
            'flex cursor-pointer items-center justify-between rounded-xl p-3 transition-shadow hover:bg-neutral-50 hover:shadow-sm',
            className,
          )}
        >
          <div className="flex items-center gap-x-2">
            <Image
              src={token.logoURI}
              alt={token.name}
              width={32}
              height={32}
              className="size-6 rounded-full shadow-md"
            />
            <div className="flex flex-col">
              <span className="font-bold text-sm">
                {token.symbol}{' '}
                {token?.extensions?.metadata?.type ? (
                  <span className="font-mono font-normal text-xs">
                    ({token?.extensions?.metadata?.type})
                  </span>
                ) : null}
              </span>
              <span className="text-2xs text-gray-500">{token.name}</span>
            </div>
          </div>
          <ERC20Balance
            address={token.address as Address}
            decimals={token.decimals}
            className="font-semibold text-sm"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="w-full md:max-w-lg">
        <DialogHeader>
          <Image
            src={token.logoURI}
            alt={token.name}
            width={32}
            height={32}
            className="size-10 rounded-full shadow-md"
          />
          <DialogTitle className="font-black text-xl">
            {token.name} <span className="font-normal">({token.symbol})</span>
          </DialogTitle>
          <div className="flex items-center gap-x-1 text-sm">
            <LinkComponent
              className="link"
              href={token?.extensions?.metadata?.url}
            >
              Website
            </LinkComponent>
            |
            <ExplorerAddressLink className="link" address={token.address}>
              Explorer
            </ExplorerAddressLink>
          </div>
          <hr className="my-6 inline-block" />
          <div className="content py-1 text-muted-foreground text-sm leading-5">
            {token?.extensions?.metadata?.description}
          </div>
          <hr className="my-6 inline-block" />
          <span className="text-xs">{token.address}</span>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
