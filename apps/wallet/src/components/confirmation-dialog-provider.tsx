// ConfirmationDialogProvider.tsx

import { useToast } from '@/lib/hooks/use-toast';
import { ToastClose } from '@radix-ui/react-toast';
import { type ReactNode, createContext, useContext } from 'react';
import { Button } from './ui/button';
import { ToastProvider, ToastViewport } from './ui/toast';

type ConfirmationDialogContextType = {
  openDialog: () => Promise<boolean>;
};

const ConfirmationDialogContext = createContext<
  ConfirmationDialogContextType | undefined
>(undefined);

export function ConfirmationDialogProvider({
  children,
}: { children: ReactNode }) {
  return (
    <ToastProvider>
      <ConfirmationDialogContextProvider>
        {children}
      </ConfirmationDialogContextProvider>
      <ToastViewport />
    </ToastProvider>
  );
}

function ConfirmationDialogContextProvider({
  children,
}: { children: ReactNode }) {
  const { toast } = useToast();

  const openDialog = () => {
    return new Promise<boolean>((resolve) => {
      // Define handleResponse inside openDialog to capture the current resolve
      const handleResponse = (value: boolean) => {
        resolve(value);
      };

      // Display the toast with action buttons
      toast({
        title: 'Wallet Request',
        description: 'Do you want to proceed?',
        action: (
          <div className="flex space-x-2">
            <ToastClose>
              <Button variant="secondary" onClick={() => handleResponse(false)}>
                Cancel
              </Button>
            </ToastClose>
            <ToastClose>
              <Button variant="default" onClick={() => handleResponse(true)}>
                Confirm
              </Button>
            </ToastClose>
          </div>
        ),
      });
    });
  };

  return (
    <ConfirmationDialogContext.Provider value={{ openDialog }}>
      {children}
    </ConfirmationDialogContext.Provider>
  );
}

export function useConfirmationDialog() {
  const context = useContext(ConfirmationDialogContext);
  if (!context) {
    throw new Error(
      'useConfirmationDialog must be used within a ConfirmationDialogProvider',
    );
  }
  return context;
}
