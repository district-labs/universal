import type { AccountState } from '@/lib/state/use-account-state';
import { useMutation } from '@tanstack/react-query';
import type { InsertInitialOwner } from '@/lib/db/schema';
import type { Address, Hex } from 'viem';

type UseSaveCredentialParams = {
  setAccountState: (params: AccountState) => void;
  removeAccountState: () => void;
};

export function useSaveCredential({
  removeAccountState,
  setAccountState,
}: UseSaveCredentialParams) {
  const { mutate, mutateAsync, ...rest } = useMutation({
    mutationKey: ['save-credential'],
    mutationFn: async (params: InsertInitialOwner) => {
      setAccountState({
        credentialId: params.credentialId,
        publicKey: params.publicKey as Hex,
        smartContractAddress: params.smartContractAddress as Address,
      });

      try {
        await insertInitialOwner(params);
      } catch (error) {
        // If there is an error inserting the initial owner, remove the account state
        removeAccountState();
        throw new Error('Error saving credential');
      }
    },
  });

  return {
    saveCredential: mutate,
    saveCredentialAsync: mutateAsync,
    ...rest,
  };
}

async function insertInitialOwner(params: InsertInitialOwner) {
  const response = await fetch(`/api/initial-owners/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Error inserting initial owner');
  }
}
