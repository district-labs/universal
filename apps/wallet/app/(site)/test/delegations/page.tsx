'use client';
import { ConnectSmartWalletButton } from '@/components/onchain/connect-smart-wallet-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { delegationFrameworkDeployments, eip712DelegationTypes, ROOT_AUTHORITY } from 'universal-wallet-delegations';
import { encodeAbiParameters, parseUnits, type Address as AddressType } from 'viem';
import { base, baseSepolia } from 'viem/chains';

import {
  useAccount,
  useDisconnect,
  useSignTypedData,
} from 'wagmi';

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
  const {address} = useAccount();
  const { data: typedDataSig, signTypedData } = useSignTypedData();

  return (
    <>
      <Card className="p-5 pt-8">
        <CardContent className="gap-x-4 flex flex-col md:flex-row gap-y-4 text-center md:text-left">
          <div className="flex-1">
            <h3 className="font-bold text-3xl mb-4">Pull Payment</h3>
            <p className="text-xs">
              Sign an authorization to allow a service to pull funds from your account.
            </p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <Button
              onClick={() =>
                signTypedData({
                  message: {
                    delegate: "0x0000000000000000000000000000000000000000",
                    delegator: address as AddressType,
                    authority: ROOT_AUTHORITY,
                    salt: BigInt(0),
                    caveats: [
                      {
                        enforcer: delegationFrameworkDeployments[baseSepolia.id].enforcerERC20TransferAmount,
                        terms: encodeAbiParameters(
                          [
                            { name: 'token', type: 'address' },
                            { name: 'maxAmount', type: 'uint255' },
                          ],
                          [delegationFrameworkDeployments[baseSepolia.id].erc20Mintable, parseUnits('420', 18)]
                        ),
                      },
                      // {
                      //   enforcer: delegationFrameworkDeployments[baseSepolia.id].enforcerTimestamp,
                      //   terms: encodeAbiParameters(
                      //     [
                      //       { name: 'timestampAfterThreshold', type: 'uint128' },
                      //       { name: 'timestampBeforeThreshold', type: 'uint128' },
                      //     ],
                      //     [BigInt(0), BigInt(addMinutesToCurrentEpoch(5))],
                      //   ),
                      // },
                    ]
                  },
                  primaryType: 'Delegation',
                  types: eip712DelegationTypes
                })
              }
            >
              Authorize
            </Button>
          </div>
        </CardContent>
        {typedDataSig && (
          <CardFooter>
            <div className="w-full break-words">
              <span className="font-bold">Signature:</span> <br />
              {typedDataSig}
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
