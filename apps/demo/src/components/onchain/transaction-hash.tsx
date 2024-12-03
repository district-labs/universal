import { type HTMLAttributes, useMemo } from 'react';
import type { Chain, Hex } from 'viem';
import { testnetChains } from 'universal-data';
import { LinkComponent } from '../ui/link-component';

interface TransactionHashProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  hash: Hex;
  truncate?: boolean;
  truncateLength?: number;
  isLink?: boolean;
  chain?: Chain;
}

const defaultChain = testnetChains[0];

export const TransactionHash = ({
  hash,
  className,
  truncate,
  truncateLength = 8,
  isLink,
  chain = defaultChain,
  ...props
}: TransactionHashProps) => {
  const blockExplorerUrl = chain?.blockExplorers?.default.url;
  const formattedHash = useMemo(
    () =>
      truncate
        ? `${hash?.slice(0, truncateLength)}...${hash?.slice(-(truncateLength - 2))}`
        : hash,
    [hash, truncate, truncateLength],
  );

  if (isLink && blockExplorerUrl) {
    return (
      <LinkComponent
        isExternal={true}
        className={className}
        href={`${blockExplorerUrl}/tx/${hash}`}
        {...props}
      >
        {formattedHash}
      </LinkComponent>
    );
  }

  return (
    <span className={className} {...props}>
      {formattedHash}
    </span>
  );
};
