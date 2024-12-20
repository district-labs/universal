import { useQuery } from '@tanstack/react-query';
import type { GetApiCredentialsReturnType } from '../client.js';

export type UseGetCredentialsParams = Partial<
  Parameters<
    GetApiCredentialsReturnType['credentials'][':did']['$get']
  >[0]['param']
>;

export function useGetCredentials(
  apiCredentialsClient: GetApiCredentialsReturnType,
  { did }: UseGetCredentialsParams,
) {
  return useQuery({
    queryKey: ['credentials-get', did],
    queryFn: async () => {
      if (!did) {
        return null;
      }
      const response = await apiCredentialsClient.credentials?.[':did'].$get({
        param: { did },
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error);
      }

      const { credentials } = await response.json();

      return credentials;
    },
    enabled: !!did,
  });
}
