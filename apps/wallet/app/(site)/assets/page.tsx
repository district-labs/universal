'use client';
import { useAccount, useChainId } from 'wagmi';
import { ConnectButton } from '@/components/onchain/connect-button';
import { OnchainAssetsTable } from '@/components/tables/onchain-assets-table';
import { Card } from '@/components/ui/card';

export default function AssetsPage() {
  const { address } = useAccount();
  const chainId = useChainId();

  return (
    <>
      {address && (
        <div className="w-full px-4">
          <div className="mt-4 flex flex-col gap-y-4">
            <Card className="p-6">
              <OnchainAssetsTable address={address} chainId={chainId} />
            </Card>
          </div>
        </div>
      )}
      {!address && (
        <>
          <div className="mt-0 flex w-full gap-y-4 flex-col justify-center items-center py-14 px-10">
            <h1 className="text-3xl font-bold">Discover What's Possible</h1>
            <ConnectButton />
          </div>
        </>
      )}
    </>
  );
}
