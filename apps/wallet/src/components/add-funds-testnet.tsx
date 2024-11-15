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
import { Button } from './ui/button';

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
      <DialogContent className="p-10">
        <DialogHeader>
          <DialogTitle className="font-black text-3xl">
            Mint Universal Test Assets
          </DialogTitle>
          <DialogDescription className="text-lg">
            Add funds to your account by minting testnet tokens. You'll be sent
            test USD, EUR and GEMS.
          </DialogDescription>
        </DialogHeader>
        <Button className="w-full" onClick={handleOnClick}>
          Mint Funds
        </Button>
      </DialogContent>
    </Dialog>
  );
};
export { AddFundsTestnet };
