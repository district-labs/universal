'use client';
import { ConnectSmartWalletButton } from '@/components/onchain/connect-smart-wallet-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  delegationFrameworkDeployments,
  useSignErc20TransferDelegation,
} from 'universal-wallet-delegations';
import { type Address as AddressType } from 'viem';
import { base, baseSepolia } from 'viem/chains';

import { useAccount, useDisconnect, useSignTypedData } from 'wagmi';

export default function TestDelegationsPage() {
  const { address } = useAccount();

  return (
    <div className="mt-0 flex w-full gap-y-4 flex-col justify-center items-center py-14 px-10 lg:px-20">
      <h1 className="text-3xl font-bold">Delegations</h1>
      {address && (
        <div className="mt-4 flex flex-col gap-y-4">
          <SignPaymentPullAuthorization />
        </div>
      )}
      {!address && (
        <ConnectSmartWalletButton className="mt-4">
          Universal Wallet
        </ConnectSmartWalletButton>
      )}
    </div>
  );
}

function SignPaymentPullAuthorization() {
  const { address } = useAccount();
  const { signDelegation, delegationSignature } =
    useSignErc20TransferDelegation();

  return (
    <>
      <Card className="p-5 pt-8">
        <CardContent className="gap-x-4 flex flex-col md:flex-row gap-y-4 text-center md:text-left">
          <div className="flex-1">
            <h3 className="font-bold text-3xl mb-4">Pull Payment</h3>
            <p className="text-xs">
              Sign an authorization to allow a service to pull funds from your
              account.
            </p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <Button
              onClick={() =>
                signDelegation({
                  chainId: baseSepolia.id,
                  delegate: '0x1000000000000000000000000000000000000000',
                  delegator: address as AddressType,
                  erc20:
                    delegationFrameworkDeployments[baseSepolia.id]
                      .erc20Mintable,
                  decimals: 18,
                  amount: '100',
                })
              }
            >
              Authorize
            </Button>
          </div>
        </CardContent>
        {delegationSignature && (
          <CardFooter>
            <div className="w-full break-words">
              <span className="font-bold">Signature:</span> <br />
              {delegationSignature}
            </div>
          </CardFooter>
        )}
      </Card>
    </>
  );
}

function Disconnect() {
  const { disconnect } = useDisconnect();
  return (
    <Button
      variant={'outline'}
      size={'lg'}
      className="w-full rounded-full"
      onClick={() => disconnect()}
    >
      Disconnect
    </Button>
  );
}
