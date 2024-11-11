'use client';
import { ConnectSmartWalletButton } from '@/components/onchain/connect-smart-wallet-button';
import { TransactionHash } from '@/components/onchain/transaction-hash';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
    <div className='mt-0 flex w-full flex-col items-center justify-center gap-y-4 px-10 py-14 lg:px-20'>
      {address && (
        <div className="w-full max-w-screen-md">
          <div className="mt-4 flex flex-col gap-y-4">
            <SendTransaction />
            <SignMessage />
            <SignTypedData />
            <WriteContracts />
            <AddChain />
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
        <CardContent className='flex flex-col gap-x-4 gap-y-4 text-center md:flex-row md:text-left'>
          <div className="flex-1">
            <h3 className='mb-4 font-bold text-3xl'>Message</h3>
            <p className="text-xs">
              Sign a message using your personal smart wallet. This message will
              be signed with your wallet's private key and can be publicly
              verified.
            </p>
          </div>
          <div className='flex flex-1 items-center justify-center'>
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
        <CardContent className='flex flex-col gap-x-4 gap-y-4 text-center md:flex-row md:text-left'>
          <div className="flex-1">
            <h3 className='mb-4 font-bold text-3xl'>Typed Data</h3>
            <p className="text-xs">
              Sign a typed data (EIP-712) object using your personal smart
              wallet. This data will be signed with your wallet's private key
              and can be publicly verified.
            </p>
          </div>
          <div className='flex flex-1 items-center justify-center'>
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
        <CardContent className='flex flex-col gap-x-4 gap-y-4 text-center md:flex-row md:text-left'>
          <div className="flex-1">
            <h3 className='mb-4 font-bold text-3xl'>Transaction</h3>
            <p className="text-xs">
              Sign a transaction to mint an NFT using your personal smart
              wallet. This transaction will be signed with your wallet's private
              key and executed onchain.
            </p>
          </div>
          <div className='flex flex-1 items-center justify-center'>
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
              <TransactionHash
                isLink={true}
                className={cn(buttonVariants({ variant: 'link' }))}
                hash={writeContractData}
              />
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
        <CardContent className='flex flex-col gap-x-4 gap-y-4 text-center md:flex-row md:text-left'>
          <div className="flex-1">
            <h3 className='mb-4 font-bold text-3xl'>Batch Transactions</h3>
            <p className="text-xs">
              Execute multiple transactions in a single batch using your
              personal smart wallet. These transactions will be signed with your
              wallet's private key and executed onchain.
            </p>
          </div>
          <div className='flex flex-1 items-center justify-center'>
            <div className='flex flex-col items-center justify-center gap-y-2'>
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
        <CardContent className='flex flex-col gap-x-4 gap-y-4 text-center md:flex-row md:text-left'>
          <div className="flex-1">
            <h3 className='mb-4 font-bold text-3xl'>Unsupported Methods</h3>
            <h3 className='mb-4 font-bold text-lg'>Watch Asset, Add Chain</h3>
            <p className="text-xs">
              Currently not supported by the Universal Wallet SDK.
            </p>
          </div>
          <div className='flex flex-1 items-center justify-center'>
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
