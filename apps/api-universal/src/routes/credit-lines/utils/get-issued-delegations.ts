import { isValidChain } from 'universal-data';
import type { DelegationsApiClient } from 'universal-delegations-sdk';
import { apiDelegationsClient } from '../../../clients.js';

export type IssuedDelegations = Exclude<
  Awaited<
    ReturnType<
      Awaited<
        ReturnType<(typeof apiDelegationsClient.delegations)['get']['$post']>
      >['json']
    >
  >,
  { error: string }
>;

export type GetIssuedDelegationsParams = Parameters<
  DelegationsApiClient['delegations']['get']['$post']
>[0]['json'];

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

export async function getIssuedDelegations(
  params: GetIssuedDelegationsParams,
): Promise<GetIssuedDelegationsReturnType> {
  if (!params.delegate && !params.delegator) {
    return { ok: false, error: 'No delegate provided' };
  }

  if (!isValidChain(params.chainId)) {
    return { ok: false, error: 'Invalid chainId' };
  }

  const issuedDelegationsResponse =
    await apiDelegationsClient.delegations.get.$post({
      json: params,
    });

  if (!issuedDelegationsResponse.ok) {
    const error = await issuedDelegationsResponse.text();
    return { ok: false, error };
  }

  const issuedDelegations = await issuedDelegationsResponse.json();

  return { ok: true, delegations: issuedDelegations };
}
