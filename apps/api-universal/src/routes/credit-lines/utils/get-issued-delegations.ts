import type { Address } from 'viem';
import { apiDelegationsClient } from '../../../clients.js';
import { isValidChain } from 'universal-data';

export type IssuedDelegations = Exclude<
  Awaited<
    ReturnType<
      Awaited<
        ReturnType<
          (typeof apiDelegationsClient.delegations.delegate)[':address'][':type']['$get']
        >
      >['json']
    >
  >,
  { error: string }
>;

export type GetIssuedDelegationsParams = {
  chainId: number;
  delegator?: Address;
  delegate?: Address;
  type: string;
};

export type GetIssuedDelegationsReturnType =
  | {
      ok: true;
      delegations: IssuedDelegations;
    }
  | {
      ok: false;
      error: string;
      delegations?: never;
    };

export async function getIssuedDelegations({
  chainId,
  delegate,
  delegator,
  type,
}: GetIssuedDelegationsParams): Promise<GetIssuedDelegationsReturnType> {
  if (!delegate && !delegator) {
    return { ok: false, error: 'No delegate provided' };
  }

  if (!isValidChain(chainId)) {
    return { ok: false, error: 'Invalid chainId' };
  }

  if (delegate) {
    const issuedDelegationsResponse =
      await apiDelegationsClient.delegations.delegate[':address'][':type'].$get(
        {
          param: {
            type,
            chainId: chainId.toString(),
            // TODO: support delegator filtering
            address: delegate,
          },
        },
      );

    if (!issuedDelegationsResponse.ok) {
      return { ok: false, error: 'Error fetching issued delegations' };
    }

    const issuedDelegations = await issuedDelegationsResponse.json();

    return { ok: true, delegations: issuedDelegations };
  }
  if (delegator) {
    const issuedDelegationsResponse =
      await apiDelegationsClient.delegations.delegator[':address'][
        ':type'
      ].$get({
        param: {
          type,
          address: delegator,
          chainId: chainId.toString(),
        },
      });

    if (!issuedDelegationsResponse.ok) {
      return { ok: false, error: 'Error fetching issued delegations' };
    }

    const issuedDelegations = await issuedDelegationsResponse.json();

    return { ok: true, delegations: issuedDelegations };
  }

  return { ok: false, error: 'No delegate provided' };
}
