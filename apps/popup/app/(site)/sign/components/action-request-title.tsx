import * as React from 'react';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

type ActionRequestTitle = React.HTMLAttributes<HTMLElement> & {
  type: 'transaction' | 'message' | 'eip712';
};

const ActionRequestTitle = ({
  children,
  className,
  type,
}: ActionRequestTitle) => {
  return (
    <h3
      className={cn('text-sm font-bold flex items-center gap-x-2', className)}
    >
      <span className="">{children}</span>
      <Dialog>
        <DialogTrigger>
          <Info className="size-4" />
        </DialogTrigger>
        <DialogContent className="rounded-xl">
          {type == 'transaction' && <Transaction />}
          {type == 'message' && <Message />}
          {type == 'eip712' && <Eip712 />}
        </DialogContent>
      </Dialog>
    </h3>
  );
};

const Transaction = () => {
  return (
    <div className="p-2">
      <h3 className="font-bold text-lg">Transaction Request</h3>
      <p className="text-sm mt-2">
        The application is requesting you to sign a transaction which will be
        sent to the blockchain.
      </p>
      <p className="text-sm mt-2 font-bold">
        Only confirm transactions that you trust.
      </p>
      <p className="text-sm mt-2">
        You're responsible for any transactions you sign.
      </p>
    </div>
  );
};

const Message = () => {
  return (
    <div>
      <h3 className="font-bold text-lg">Signature Request</h3>
      <p className="text-sm mt-2">
        The application is requesting you to sign a normal message.
      </p>
      <p className="text-sm mt-2">
        The message will not be sent to the blockchain.
      </p>
      <p className="text-sm mt-2">
        It's generally used for authentication or signing other documents.
      </p>
    </div>
  );
};

const Eip712 = () => {
  return (
    <div>
      <h3 className="font-bold text-lg">Authorization Request</h3>
      <p className="text-sm mt-2">
        The application is requesting you to sign an EIP-712 message.
      </p>
      <p className="text-sm mt-2 font-bold">
        Only confirm transactions that you trust.
      </p>
      <p className="text-sm mt-2">
        The message can be used to execute an onchain action(s) on your behalf.
      </p>
      <p className="text-sm mt-2">
        You're responsible for any transactions you sign.
      </p>
    </div>
  );
};

export { ActionRequestTitle };
