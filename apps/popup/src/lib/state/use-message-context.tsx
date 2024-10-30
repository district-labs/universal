import { Chain } from '@/types';
import { createContext, useContext, useState, type ReactNode } from 'react';

export type MessageContextType = {
  method: string;
  params: any;
  requestId: string;
  sender: string;
  chainId: Chain['id'];
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
