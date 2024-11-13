import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';
import type * as React from 'react';

export type ActionRequestTitle = React.HTMLAttributes<HTMLElement> & {
  type: 'transaction' | 'message' | 'eip712' | 'did' | 'delegation' | 'verificationRequest';
};

export const ActionRequestTitle = ({
  children,
  className,
  type,
}: ActionRequestTitle) => {
  return (
    <h3
      className={cn('flex items-center gap-x-2 font-bold text-sm', className)}
    >
      <span className="">{children}</span>
      <Dialog>
        <DialogTrigger>
          <Info className="size-4" />
        </DialogTrigger>
        <DialogContent className="rounded-xl">
          {type === 'transaction' && <Transaction />}
          {type === 'message' && <Message />}
          {type === 'eip712' && <Eip712 />}
          {type === 'delegation' && <Eip712 />}
          {type === 'did' && <UniversalDID />}
          {type === 'verificationRequest' && <VerificationRequest />}
        </DialogContent>
      </Dialog>
    </h3>
  );
};

const Transaction = () => {
  return (
    <div className="p-2">
      <h3 className="font-bold text-lg">Transaction Request</h3>
      <p className="mt-2 text-sm">
        The application is requesting you to sign a transaction which will be
        sent to the blockchain.
      </p>
      <p className="mt-2 font-bold text-sm">
        Only confirm transactions that you trust.
      </p>
      <p className="mt-2 text-sm">
        You're responsible for any transactions you sign.
      </p>
    </div>
  );
};

const Message = () => {
  return (
    <div>
      <h3 className="font-bold text-lg">Signature Request</h3>
      <p className="mt-2 text-sm">
        The application is requesting you to sign a normal message.
      </p>
      <p className="mt-2 text-sm">
        The message will not be sent to the blockchain.
      </p>
      <p className="mt-2 text-sm">
        It's generally used for authentication or signing other documents.
      </p>
    </div>
  );
};

const Eip712 = () => {
  return (
    <div>
      <h3 className="font-bold text-lg">Authorization Request</h3>
      <p className="mt-2 text-sm">
        The application is requesting you to sign an EIP-712 message.
      </p>
      <p className="mt-2 font-bold text-sm">
        Only confirm transactions that you trust.
      </p>
      <p className="mt-2 text-sm">
        The message can be used to execute an onchain action(s) on your behalf.
      </p>
      <p className="mt-2 text-sm">
        You're responsible for any transactions you sign.
      </p>
    </div>
  );
};

const UniversalDID = () => {
  return (
    <div>
      <h3 className="font-bold text-lg">Universal DID</h3>
      <p className="mt-2 text-sm">
        The application is requesting you to update your Universal DID.
      </p>
      <p className="mt-2 font-bold text-sm">
        Only confirm requests that you trust.
      </p>
      <p className="mt-2 text-sm">
        You're responsible for any messages/updates you authorize.
      </p>
    </div>
  );
};

const VerificationRequest = () => {
  return (
    <div>
      <h3 className="font-bold text-lg">Verification Request</h3>
      <p className="mt-2 text-sm">
        The application is requesting you to verify your account address.
      </p>
      <p className="mt-2 font-bold text-sm">
        Only confirm requests that you trust.
      </p>
      <p className="mt-2 text-sm">
        You're responsible for any messages/updates you authorize.
      </p>
    </div>
  );
};
