import { useQuery } from '@tanstack/react-query';
import { Address, Hex } from 'viem';
import { SelectInitialOwner } from '../schema';

type UseGetInitialOwnersParams =
  | {
      mode: 'publicKey';
      publicKey: Hex;
    }
  | {
      mode: 'credentialId';
      credentialId: string;
    }
  | {
      mode: 'smartContractAddress';
      smartContractAddress: Address;
    };

export function useGetInitialOwners(params: UseGetInitialOwnersParams) {
  return useQuery({
    queryKey: ['get-initialOwners', params],
    queryFn: async () => getInitialOwners(params),
  });
}

export async function getInitialOwners(params: UseGetInitialOwnersParams) {
  const param =
    params.mode === 'publicKey'
      ? params.publicKey
      : params.mode === 'credentialId'
        ? params.credentialId
        : params.smartContractAddress;
  const response = await fetch(
    `/api/initial-owners/${param}?search=${params.mode}`,
  );
  if (!response.ok) {
    throw new Error('Error fetching initial owner');
  }
  return response.json() as Promise<SelectInitialOwner | null>;
}
