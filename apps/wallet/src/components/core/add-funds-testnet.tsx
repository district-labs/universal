import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { defaultTokenList, useIsValidChain } from '@/lib/chains';
import type * as React from 'react';
import { type Address, parseUnits } from 'viem';
import { useAccount, useSwitchChain } from 'wagmi';
import { useWriteContracts } from 'wagmi/experimental';
import { ConnectUniversalWalletButton } from '../onchain/connect-universal-wallet';
import { IsWalletConnected } from '../onchain/is-wallet-connected';
import { IsWalletDisconnected } from '../onchain/is-wallet-disconnected';
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
  const { isValidChain, chainId } = useIsValidChain();
  const { writeContracts } = useWriteContracts();
  const { switchChain, isPending: isPendingSwitchChain } = useSwitchChain();

  function handleOnClick() {
    writeContracts({
      contracts: [
        {
          abi: MINT_ABI,
          address: defaultTokenList.tokens[0].address as Address,
          functionName: 'mint',
          args: [
            address as Address,
            parseUnits('250', defaultTokenList.tokens[0].decimals),
          ],
        },
        {
          abi: MINT_ABI,
          address: defaultTokenList.tokens[1].address as Address,
          functionName: 'mint',
          args: [
            address as Address,
            parseUnits('250', defaultTokenList.tokens[1].decimals),
          ],
        },
        {
          abi: MINT_ABI,
          address: defaultTokenList.tokens[2].address as Address,
          functionName: 'mint',
          args: [
            address as Address,
            parseUnits('25', defaultTokenList.tokens[2].decimals),
          ],
        },
      ],
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild={true}>{children}</DialogTrigger>
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
        <IsWalletDisconnected>
          <ConnectUniversalWalletButton
            size="lg"
            className="rounded-full py-3 text-lg"
          >
            Connect Universal Wallet
          </ConnectUniversalWalletButton>
        </IsWalletDisconnected>
        <IsWalletConnected>
          {isValidChain ? (
            <Button
              className="w-full text-lg"
              rounded={'full'}
              size={'lg'}
              onClick={handleOnClick}
            >
              Mint Testnet Tokens
            </Button>
          ) : (
            <Button
              className="w-full text-lg"
              rounded={'full'}
              size={'lg'}
              disabled={isPendingSwitchChain}
              onClick={() =>
                switchChain({
                  chainId,
                })
              }
            >
              Switch Chains
            </Button>
          )}
        </IsWalletConnected>
      </DialogContent>
    </Dialog>
  );
};
export { AddFundsTestnet };
