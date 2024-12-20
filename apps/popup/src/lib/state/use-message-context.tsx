import { type ReactNode, createContext, useContext, useState } from 'react';
import type { ValidChain } from 'universal-data';

export type MessageContextType = {
  method: string;
  // biome-ignore lint/suspicious/noExplicitAny: any
  params: any;
  requestId: string;
  sender: string;
  chainId: ValidChain['id'];
  origin: string;
};

export type UseMessageContextReturnType = ReturnType<typeof useMessageContext>;

const MessageContext = createContext<{
  message: MessageContextType | undefined;
  setMessage: (message: MessageContextType) => void;
}>({ message: undefined, setMessage: () => {} });

export function MessageProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<MessageContextType>();
  return (
    <MessageContext.Provider value={{ message, setMessage }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessageContext() {
  return useContext(MessageContext);
}
