'use client';
import { Button } from '@/components/ui/button';
import { ActionRequestFooter } from '../components/action-request-footer';
import { ActionRequestHeader } from '../components/action-request-header';
import { ActionRequestMain } from '../components/action-request-main';
import { ActionRequestTitle } from '../components/action-request-title';
import { useSignMessage } from './hooks/use-sign-message';

export default function EthPersonalSignPage() {
  const { signMessage, formattedMessage, messageHash, isPending } =
    useSignMessage();

  if (!messageHash) {
    return (
      <div className="mt-0 flex w-full flex-col items-center justify-center px-10 py-4 lg:px-20">
        Invalid message
      </div>
    );
  }
  return (
    <div className="flex h-full w-full flex-1 flex-col justify-between">
      <ActionRequestHeader className="relative z-50 w-full border-neutral-100 border-b-2 bg-neutral-50 py-2 text-center">
        <ActionRequestTitle type="message">
          Signature Request
        </ActionRequestTitle>
      </ActionRequestHeader>
      <ActionRequestMain className="px-4 py-4">
        <div className="h-full max-h-[320px] flex-1 overflow-auto rounded-lg bg-neutral-100 p-4 text-sm">
          <pre className="font-mono text-xs">{`${formattedMessage}`}</pre>
        </div>
      </ActionRequestMain>
      <ActionRequestFooter>
        <Button
          className="w-full flex-1 rounded-full"
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
