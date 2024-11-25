'use client';

import { useMessageContext } from '@/lib/state/use-message-context';
import { LucideXCircle } from 'lucide-react';
import { ActionRequestFooter } from '../sign/components/action-request-footer';
import { ActionRequestMain } from '../sign/components/action-request-main';

export default function SignEthRequestsAccountsPage() {
  const { message } = useMessageContext();
  return (
    <>
      <ActionRequestMain className="h-full flex-1 items-center justify-center px-4 py-4">
        <LucideXCircle className="text-red-500" size={42} />
        <h2 className="font-bold text-2xl">This method is unsupported</h2>
        <h3>We do not currently support {message?.method}. </h3>
      </ActionRequestMain>
      <ActionRequestFooter />
    </>
  );
}
