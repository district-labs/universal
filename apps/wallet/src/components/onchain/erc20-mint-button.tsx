import type * as React from 'react';
import type { Address } from 'viem';
import { useWriteContract } from 'wagmi';
import { cn } from '@/lib/utils';

type ERC20Mint = React.HTMLAttributes<HTMLElement> & {
  address: Address;
  to?: Address;
  amount: bigint;
};

const ERC20Mint = ({ children, className, address, to, amount }: ERC20Mint) => {
  const classes = cn(className);
  const { writeContract } = useWriteContract();
  return (
    <span
      className={classes}
      onClick={() =>
        writeContract({
          abi: [
            {
              type: 'function',
              name: 'mint',
              inputs: [
                { name: 'to', type: 'address', internalType: 'address' },
                { name: 'amount', type: 'uint256', internalType: 'uint256' },
              ],
              outputs: [],
              stateMutability: 'nonpayable',
            },
          ],
          address: address,
          functionName: 'mint',
          args: [to as Address, amount],
        })
      }
    >
      {children}
    </span>
  );
};
export { ERC20Mint };
