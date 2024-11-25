'use client';
import { Button } from '@/components/ui/button';
import { CHAINS } from '@/lib/constants';
import { sendMessageToOpener } from '@/lib/pop-up/actions/send-message-to-opener';
import { useAccountState } from '@/lib/state/use-account-state';
import { useMessageContext } from '@/lib/state/use-message-context';
import { useSessionState } from '@/lib/state/use-session-state';
import Image from 'next/image';
import { ActionRequestFooter } from '../components/action-request-footer';
import { ActionRequestHeader } from '../components/action-request-header';
import { ActionRequestMain } from '../components/action-request-main';

export default function SignEthRequestsAccountsPage() {
  const { accountState } = useAccountState();
  const { sessionState } = useSessionState();
  const { message } = useMessageContext();

  return (
    <div className="flex h-full w-full flex-1 flex-col justify-between">
      <ActionRequestHeader className="relative z-50 w-full bg-neutral-100 pt-4 pb-10 text-center">
        <Image
          alt="App Logo"
          width={32}
          height={32}
          src={message?.params.appLogoUrl}
          className="mx-auto h-8 w-8 rounded-full"
        />
        <h1 className="font-bold text-3xl">{message?.params.appName}</h1>
        <h4 className="mt-1 font-normal text-lg">Connection Request</h4>
      </ActionRequestHeader>
      <ActionRequestMain className="px-14">
        <Button
          variant="white"
          className="-mt-6 mx-auto rounded-full px-8 font-bold"
        >
          Permissions
        </Button>
        <ul className="mt-8 list-disc text-left leading-8">
          <li>View public wallet address.</li>
          <li>Lookup public wallet information.</li>
          <li>Send additional action requests.</li>
        </ul>
      </ActionRequestMain>
      <ActionRequestFooter>
        <Button
          className="w-full flex-1 rounded-full"
          size="lg"
          disabled={
            !accountState ||
            !message?.requestId ||
            !message.sender ||
            !sessionState?.sessionPrivateKey ||
            !sessionState?.sessionPublicKey
          }
          onClick={async () => {
            if (
              !accountState ||
              !message?.requestId ||
              !message.sender ||
              !sessionState?.sessionPrivateKey ||
              !sessionState?.sessionPublicKey
            ) {
              return;
            }
            sendMessageToOpener({
              value: [accountState.smartContractAddress],
              requestId: message?.requestId,
              ownPrivateKey: sessionState.sessionPrivateKey,
              ownPublicKey: sessionState.sessionPublicKey,
              peerPublicKey: message.sender,
              chains: CHAINS,
            });
          }}
        >
          Confirm
        </Button>
      </ActionRequestFooter>
    </div>
  );
}
