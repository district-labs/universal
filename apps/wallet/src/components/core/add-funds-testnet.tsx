import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type * as React from 'react';
import { tokenList } from 'universal-data';
import { type Address, parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import { useWriteContracts } from 'wagmi/experimental';
import { Button } from '../ui/button';

const MINT_ABI = [
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
] as const;

type AddFundsTestnet = React.HTMLAttributes<HTMLElement>;

const AddFundsTestnet = ({ children }: AddFundsTestnet) => {
  const { address } = useAccount();
  const { writeContracts } = useWriteContracts();

  function handleOnClick() {
    writeContracts({
      contracts: [
        {
          abi: MINT_ABI,
          address: tokenList.tokens[0].address as Address,
          functionName: 'mint',
          args: [
            address as Address,
            parseUnits('250', tokenList.tokens[0].decimals),
          ],
        },
        {
          abi: MINT_ABI,
          address: tokenList.tokens[1].address as Address,
          functionName: 'mint',
          args: [
            address as Address,
            parseUnits('100', tokenList.tokens[1].decimals),
          ],
        },
        {
          abi: MINT_ABI,
          address: tokenList.tokens[2].address as Address,
          functionName: 'mint',
          args: [
            address as Address,
            parseUnits('25', tokenList.tokens[2].decimals),
          ],
        },
      ],
    });
  }

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="px-10 pt-10 pb-6">
        <DialogHeader className="sm:text-center">
          <DialogTitle className="font-black text-4xl">
            <span className="text-8xl">🐳</span>
            <br />
            Testnet Whale
          </DialogTitle>
          <DialogDescription>
            <span className="font-bold text-lg">
              Become a beta tester on Base Sepolia!
            </span>{' '}
            <br />
            You'll be sent testnet USD, EUR and GEMS for free.
          </DialogDescription>
        </DialogHeader>
        <Button
          className="w-full text-lg"
          rounded={'full'}
          size={'lg'}
          onClick={handleOnClick}
        >
          Mint Testnet Tokens
        </Button>
      </DialogContent>
    </Dialog>
  );
};
export { AddFundsTestnet };
