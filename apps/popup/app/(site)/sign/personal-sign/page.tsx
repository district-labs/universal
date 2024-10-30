'use client';
import { Button } from '@/components/ui/button';
import { ActionRequestHeader } from '../components/action-request-header';
import { ActionRequestMain } from '../components/action-request-main';
import { ActionRequestFooter } from '../components/action-request-footer';
import { ActionRequestTitle } from '../components/action-request-title';
import { useSignMessage } from './hooks/use-sign-message';

export default function PersonalSignPage() {
  const { signMessage, formattedMessage, messageHash, isPending, status } =
    useSignMessage();

  if (!messageHash) {
    return (
      <div className="mt-0 flex w-full flex-col justify-center items-center py-4 px-10 lg:px-20">
        Invalid message
      </div>
    );
  }
  return (
    <div className="flex flex-1 w-full flex-col justify-between h-full">
      <ActionRequestHeader className="text-center bg-neutral-50 border-b-2 border-neutral-100 w-full py-2 z-50 relative">
        <ActionRequestTitle type="message">
          Signature Request
        </ActionRequestTitle>
      </ActionRequestHeader>
      <ActionRequestMain className="px-4 py-4">
        <div className="max-h-[320px] h-full bg-neutral-100 rounded-lg flex-1 p-4 text-sm overflow-auto">
          <pre className="font-mono text-xs">{`${formattedMessage}`}</pre>
        </div>
      </ActionRequestMain>
      <ActionRequestFooter>
        <Button
          className="flex-1 w-full rounded-full"
          size="lg"
          disabled={!signMessage || isPending}
          onClick={() => signMessage?.()}
        >
          {isPending ? 'Signing...' : 'Sign Message'}
        </Button>
      </ActionRequestFooter>
    </div>
  );
}
