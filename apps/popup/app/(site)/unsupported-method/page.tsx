'use client';

import { useMessageContext } from '@/lib/state/use-message-context';
import { LucideXCircle } from 'lucide-react';
import { ActionRequestMain } from '../sign/components/action-request-main';
import { ActionRequestFooter } from '../sign/components/action-request-footer';

export default function SignEthRequestsAccountsPage() {
  const { message } = useMessageContext();
  return (
    <>
      <ActionRequestMain className="px-4 py-4 items-center justify-center h-full flex-1">
        <LucideXCircle className="text-red-500" size={42} />
        <h2 className="text-2xl font-bold">This method is unsupported</h2>
        <h3>We do not currently support {message?.method}. </h3>
      </ActionRequestMain>
      <ActionRequestFooter />
    </>
  );
}
