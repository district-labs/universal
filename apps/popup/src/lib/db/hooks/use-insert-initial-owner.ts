import { useMutation } from '@tanstack/react-query';
import type { InsertInitialOwner } from '../schema';

export function useInsertInitialOwner() {
  const { mutate, mutateAsync, ...rest } = useMutation({
    mutationKey: ['insert-initialOwners'],
    mutationFn: async (params: InsertInitialOwner) => {
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
    },
  });

  return {
    insertInitialOwner: mutate,
    insertInitialOwnerAsync: mutateAsync,
    ...rest,
  };
}
