'use client';
import { Button } from '@/components/ui/button';
import { useAccountState } from '@/lib/state/use-account-state';
import { useMessageContext } from '@/lib/state/use-message-context';
import { useSessionState } from '@/lib/state/use-session-state';
import { sendMessageToOpener } from '@/lib/pop-up/actions/send-message-to-opener';
import { CHAINS } from '@/lib/constants';
import { ActionRequestFooter } from '../components/action-request-footer';
import { ActionRequestMain } from '../components/action-request-main';
import { ActionRequestHeader } from '../components/action-request-header';

export default function SignEthRequestsAccountsPage() {
  const { accountState } = useAccountState();
  const { sessionState } = useSessionState();
  const { message } = useMessageContext();

  return (
    <div className="flex flex-1 w-full flex-col justify-between h-full">
      <ActionRequestHeader className="text-center bg-neutral-100 w-full pt-4 pb-10 z-50 relative">
        <img
          src={message?.params.appLogoUrl}
          className="w-8 h-8 mx-auto rounded-full"
        />
        <h1 className="text-3xl font-bold">{message?.params.appName}</h1>
        <h4 className="text-lg font-normal mt-1">Connection Request</h4>
      </ActionRequestHeader>
      <ActionRequestMain className="px-14">
        <Button
          variant="white"
          className="rounded-full font-bold mx-auto -mt-6 px-8"
        >
          Permissions
        </Button>
        <ul className="list-disc text-left mt-8 leading-8">
          <li>View public wallet address.</li>
          <li>Lookup public wallet information.</li>
          <li>Send additional action requests.</li>
        </ul>
      </ActionRequestMain>
      <ActionRequestFooter>
        <Button
          className="flex-1 w-full rounded-full"
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
