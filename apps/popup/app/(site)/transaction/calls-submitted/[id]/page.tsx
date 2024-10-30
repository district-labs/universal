'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { closePopup } from '@/lib/pop-up/actions/close-pop-up';
import { LucideCheckCircle2, LucideXCircle } from 'lucide-react';
import Link from 'next/link';
import { type Hex } from 'viem';
import { baseSepolia } from 'viem/chains';
import { useWaitForUserOpReceipt } from './hooks/use-wait-for-user-op-receipt';
import { useMessageContext } from '@/lib/state/use-message-context';

function ViewTransactionLink({
  transactionHash,
}: { transactionHash: Hex | undefined }) {
  if (!transactionHash) {
    return <Skeleton className="h-18" />;
  }
  return (
    <Link
      target="_blank"
      rel="noopener noreferrer"
      href={baseSepolia.blockExplorers.default.url + '/tx/' + transactionHash}
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
      <div className="mt-0 flex w-full text-center flex-col justify-center gap-y-4 items-center py-20 px-10 lg:px-20">
        <LucideXCircle className="text-red-500" size={80} />
        <h2 className="text-2xl font-bold">Error Sending Transaction</h2>
        <ViewTransactionLink transactionHash={data?.receipt?.transactionHash} />
        <Button variant={'outline'} onClick={closePopup}>
          Close
        </Button>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="mt-0 flex w-full text-center flex-col justify-center gap-y-4 items-center py-20 px-10 lg:px-20">
        <h2 className="text-2xl font-bold">Transaction Pending</h2>
        <Button variant={'outline'} onClick={closePopup}>
          Close
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-0 flex w-full text-center flex-col justify-center gap-y-4 items-center py-20 px-10 lg:px-20">
      <LucideCheckCircle2 className="text-green-700" size={80} />
      <h2 className="text-2xl font-bold">Transaction Sent</h2>
      <ViewTransactionLink transactionHash={data?.receipt?.transactionHash} />
      <Button variant={'outline'} onClick={closePopup}>
        Close
      </Button>
    </div>
  );
}
