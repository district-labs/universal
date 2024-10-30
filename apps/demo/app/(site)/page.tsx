'use client';
import { ConnectSmartWalletButton } from '@/components/onchain/connect-smart-wallet-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useState } from 'react';
import { Hex, erc20Abi, zeroAddress } from 'viem';
import { base, baseSepolia } from 'viem/chains';

import {
  useAccount,
  useChainId,
  useDisconnect,
  useSignMessage,
  useSignTypedData,
  useSwitchChain,
  useWalletClient,
  useWriteContract,
} from 'wagmi';
import { useShowCallsStatus, useWriteContracts } from 'wagmi/experimental';

export default function HomePage() {
  const { address } = useAccount();

  return (
    <div className="mt-0 flex w-full gap-y-4 flex-col justify-center items-center py-14 px-10 lg:px-20">
      <h1 className="text-3xl font-bold">Discover What's Possible</h1>
      {address && (
        <div className="w-full max-w-screen-md">
          <Button size={'lg'} className="w-full rounded-full">
            {address}
          </Button>
          <div className="mt-4 flex flex-col gap-y-4">
            <Disconnect />
            <SendTransaction />
            <SignMessage />
            <SignTypedData />
            <WriteContracts />
            <AddChain />
            {/* <ReadMethods /> */}
            {/* <SwitchChain /> */}
          </div>
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

function SignMessage() {
  const { data: messageSig, signMessage } = useSignMessage();

  const message = `{
  "@context": ["https://www.w3.org/ns/did/v1"],
  "id": "did:uis:31337:0x5991a2df15a8f6a256d3ec51e99254cd3fb576a9:0x2b8dad3f2091626459e37db6e7ef905e61147c1c",
  "verificationMethod": [{"id": "did:uis:31337:0x5991a2df15a8f6a256d3ec51e99254cd3fb576a9:0x2b8dad3f2091626459e37db6e7ef905e61147c1c#controller-key","type": "EthEip6492","controller": "did:uis:31337:0x5991a2df15a8f6a256d3ec51e99254cd3fb576a9:0x2b8dad3f2091626459e37db6e7ef905e61147c1c"}],"authentication": ["did:uis:31337:0x5991a2df15a8f6a256d3ec51e99254cd3fb576a9:0x2b8dad3f2091626459e37db6e7ef905e61147c1c#controller-key"],"assertionMethod": ["did:uis:31337:0x5991a2df15a8f6a256d3ec51e99254cd3fb576a9:0x2b8dad3f2091626459e37db6e7ef905e61147c1c#controller-key"]}`;

  return (
    <>
      <Card className="p-5 pt-8">
        <CardContent className="gap-x-4 flex flex-col md:flex-row gap-y-4 text-center md:text-left">
          <div className="flex-1">
            <h3 className="font-bold text-3xl mb-4">Message</h3>
            <p className="text-xs">
              Sign a message using your personal smart wallet. This message will
              be signed with your wallet's private key and can be publicly
              verified.
            </p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <Button onClick={() => signMessage({ message: message })}>
              Sign Message
            </Button>
          </div>
        </CardContent>
        {messageSig && (
          <CardFooter>
            <div className="w-full break-words">
              <span className="font-bold">Signature:</span> <br />
              {messageSig}
            </div>
          </CardFooter>
        )}
      </Card>
    </>
  );
}

function SignTypedData() {
  const { data: typedDataSig, signTypedData } = useSignTypedData();

  return (
    <>
      <Card className="p-5 pt-8">
        <CardContent className="gap-x-4 flex flex-col md:flex-row gap-y-4 text-center md:text-left">
          <div className="flex-1">
            <h3 className="font-bold text-3xl mb-4">Typed Data</h3>
            <p className="text-xs">
              Sign a typed data (EIP-712) object using your personal smart
              wallet. This data will be signed with your wallet's private key
              and can be publicly verified.
            </p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <Button
              onClick={() =>
                signTypedData({
                  message: {
                    from: {
                      name: 'Alice',
                      wallet: '0x0000000000000000000000000000000000000000',
                    },
                    to: {
                      name: 'Bob',
                      wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
                    },
                    contents:
                      'Pellentesque tempor ipsum id orci cursus, a convallis diam dapibus. Sed bibendum leo sit amet commodo dignissim.',
                    tags: ['urgent', 'confidential'],
                  },
                  primaryType: 'Mail',
                  types: {
                    EIP712Domain: [],
                    Person: [
                      {
                        name: 'name',
                        type: 'string',
                      },
                      {
                        name: 'wallet',
                        type: 'address',
                      },
                    ],
                    Mail: [
                      {
                        name: 'from',
                        type: 'Person',
                      },
                      {
                        name: 'to',
                        type: 'Person',
                      },
                      {
                        name: 'contents',
                        type: 'string',
                      },
                      {
                        name: 'tags',
                        type: 'string[]',
                      },
                    ],
                  },
                })
              }
            >
              Sign Data
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

function SendTransaction() {
  const myNFTABI = [
    {
      stateMutability: 'nonpayable',
      type: 'function',
      inputs: [{ name: 'to', type: 'address' }],
      name: 'safeMint',
      outputs: [],
    },
  ] as const;

  const myNFTAddress = '0x119Ea671030FBf79AB93b436D2E20af6ea469a19';
  const { address } = useAccount();
  const { data: writeContractData, writeContract } = useWriteContract();

  return (
    <>
      <Card className="p-5 pt-8">
        <CardContent className="gap-x-4 flex flex-col md:flex-row gap-y-4 text-center md:text-left">
          <div className="flex-1">
            <h3 className="font-bold text-3xl mb-4">Transaction</h3>
            <p className="text-xs">
              Sign a transaction to mint an NFT using your personal smart
              wallet. This transaction will be signed with your wallet's private
              key and executed onchain.
            </p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <Button
              onClick={() =>
                writeContract({
                  address: myNFTAddress,
                  abi: myNFTABI,
                  functionName: 'safeMint',
                  args: [address!],
                })
              }
            >
              Sign Transaction
            </Button>
          </div>
        </CardContent>
        {writeContractData && (
          <CardFooter>
            <div className="w-full break-words">
              <span className="font-bold">Transaction Hash:</span> <br />
              {writeContractData}
            </div>
          </CardFooter>
        )}
      </Card>
    </>
  );
}

function WriteContracts() {
  const myNFTABI = [
    {
      stateMutability: 'nonpayable',
      type: 'function',
      inputs: [{ name: 'to', type: 'address' }],
      name: 'safeMint',
      outputs: [],
    },
  ] as const;

  const myNFTAddress = '0x119Ea671030FBf79AB93b436D2E20af6ea469a19';
  const { address } = useAccount();
  const { data: writeContractsData, writeContracts } = useWriteContracts();
  const { showCallsStatus } = useShowCallsStatus();
  const erc20MintableAbi = [
    {
      type: 'function',
      name: 'mint',
      stateMutability: 'nonpayable',
      inputs: [
        {
          name: 'to',
          type: 'address',
        },
        {
          name: 'amount',
          type: 'uint256',
        },
      ],
      outputs: [],
    },
  ] as const;

  return (
    <>
      <Card className="p-5 pt-8">
        <CardContent className="gap-x-4 flex flex-col md:flex-row gap-y-4 text-center md:text-left">
          <div className="flex-1">
            <h3 className="font-bold text-3xl mb-4">Batch Transactions</h3>
            <p className="text-xs">
              Execute multiple transactions in a single batch using your
              personal smart wallet. These transactions will be signed with your
              wallet's private key and executed onchain.
            </p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center justify-center flex-col gap-y-2">
              <Button
                onClick={() =>
                  writeContracts({
                    contracts: [
                      {
                        address: '0x4C8Be898BdE148aE6f9B0AF86e7D2b5a0558A7d0',
                        abi: erc20MintableAbi,
                        functionName: 'mint',
                        args: [address, 120n * 10n ** 18n],
                      },
                      {
                        address: myNFTAddress,
                        abi: myNFTABI,
                        functionName: 'safeMint',
                        args: [address],
                      },
                    ],
                  })
                }
              >
                Write Contracts
              </Button>
              <Button
                disabled={!writeContractsData}
                onClick={() =>
                  showCallsStatus({
                    id: writeContractsData!,
                  })
                }
              >
                Show Calls Status
              </Button>
            </div>
          </div>
        </CardContent>
        {writeContractsData && (
          <CardFooter>
            <div className="w-full break-words">
              <span className="font-bold">UserOp Hash:</span> <br />
              {writeContractsData}
            </div>
          </CardFooter>
        )}
      </Card>
    </>
  );
}

function AddChain() {
  const { data: walletClient } = useWalletClient();

  return (
    <div>
      <Card className="p-5 pt-8">
        <CardContent className="gap-x-4 flex flex-col md:flex-row gap-y-4 text-center md:text-left">
          <div className="flex-1">
            <h3 className="font-bold text-3xl mb-4">Unsupported Methods</h3>
            <h3 className="font-bold text-lg mb-4">Watch Asset, Add Chain</h3>
            <p className="text-xs">
              Currently not supported by the Universal Wallet SDK.
            </p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <Button
              onClick={async () => {
                if (!walletClient) return;
                await walletClient.watchAsset({
                  type: 'ERC20',
                  options: {
                    address: '0x4200000000000000000000000000000000000017',
                    symbol: 'WETH',
                    decimals: 18,
                  },
                });
              }}
            >
              Watch Asset (Example)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ReadMethods() {
  const chainId = useChainId();
  const { data: walletClient, error } = useWalletClient();
  const [signature, setSignature] = useState<Hex>();

  return (
    <div>
      <div>Sig: {signature}</div>
      <div>Error: {error && JSON.stringify(error, null, 2)}</div>
      {chainId === base.id && (
        <Button
          onClick={async () => {
            if (!walletClient) return;
            const sig = await walletClient.sendTransaction({
              to: zeroAddress,
              value: 0n,
              data: '0x12',
            });
            setSignature(sig);
          }}
        >
          Send Tx
        </Button>
      )}
    </div>
  );
}

function SwitchChain() {
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  return (
    <div>
      <div>: {chainId}</div>
      {chainId === base.id && (
        <Button
          onClick={() =>
            switchChain({
              chainId: baseSepolia.id,
            })
          }
        >
          Switch to Base Sepolia
        </Button>
      )}
      {chainId === baseSepolia.id && (
        <Button
          onClick={() =>
            switchChain({
              chainId: base.id,
            })
          }
        >
          Switch to Base
        </Button>
      )}
    </div>
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
