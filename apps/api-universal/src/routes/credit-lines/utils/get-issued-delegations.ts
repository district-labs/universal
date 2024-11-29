import type { Address } from 'viem';
import { apiDelegationsClient } from '../../../clients.js';

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
  delegate,
  type,
}: GetIssuedDelegationsParams): Promise<GetIssuedDelegationsReturnType> {
  if (!delegate) {
    return { ok: false, error: 'No delegate provided' };
  }

  const issuedDelegationsResponse =
    await apiDelegationsClient.delegations.delegate[':address'][':type'].$get({
      param: {
        type,
        // TODO: support delegator filtering
        address: delegate,
      },
    });

  if (!issuedDelegationsResponse.ok) {
    return { ok: false, error: 'Error fetching issued delegations' };
  }

  const issuedDelegations = await issuedDelegationsResponse.json();

  return { ok: true, delegations: issuedDelegations };
}
