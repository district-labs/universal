'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { closePopup } from '@/lib/pop-up/actions/close-pop-up';
import { useMessageContext } from '@/lib/state/use-message-context';
import { cn } from '@/lib/utils';
import { LucideCheckCircle2, LucideXCircle } from 'lucide-react';
import Link from 'next/link';
import { productionChains } from 'universal-data';
import type { Chain, Hex } from 'viem';
import { useWaitForUserOpReceipt } from './hooks/use-wait-for-user-op-receipt';

type ViewTransactionLinkProps = {
  transactionHash: Hex | undefined;
  chain?: Chain;
};

const defaultChain = productionChains[0];

function ViewTransactionLink({
  chain = defaultChain,
  transactionHash,
}: ViewTransactionLinkProps) {
  if (!transactionHash) {
    return <Skeleton className="h-18" />;
  }
  return (
    <Link
      target="_blank"
      rel="noopener noreferrer"
      href={`${chain.blockExplorers?.default.url || defaultChain.blockExplorers.default.url}/tx/${transactionHash}`}
      className={cn(buttonVariants())}
    >
      View Transaction
    </Link>
  );
}

export default function CallsSubmittedPage({
  params: { id },
}: {
  params: {
    id: Hex | undefined;
  };
}) {
  const { message } = useMessageContext();
  const { data, status } = useWaitForUserOpReceipt({
    hash: id,
    chainId: message?.chainId,
  });

  if (status === 'error') {
    return (
      <div className="mt-0 flex w-full flex-col items-center justify-center gap-y-4 px-10 py-20 text-center lg:px-20">
        <LucideXCircle className="text-red-500" size={80} />
        <h2 className="font-bold text-2xl">Error Sending Transaction</h2>
        <ViewTransactionLink transactionHash={data?.receipt?.transactionHash} />
        <Button variant={'outline'} onClick={closePopup}>
          Close
        </Button>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="mt-0 flex w-full flex-col items-center justify-center gap-y-4 px-10 py-20 text-center lg:px-20">
        <h2 className="font-bold text-2xl">Transaction Pending</h2>
        <Button variant={'outline'} onClick={closePopup}>
          Close
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-0 flex w-full flex-col items-center justify-center gap-y-4 px-10 py-20 text-center lg:px-20">
      <LucideCheckCircle2 className="text-green-700" size={80} />
      <h2 className="font-bold text-2xl">Transaction Sent</h2>
      <ViewTransactionLink transactionHash={data?.receipt?.transactionHash} />
      <Button variant={'outline'} onClick={closePopup}>
        Close
      </Button>
    </div>
  );
}
