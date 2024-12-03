import type { RedeemedCreditLinesResponse } from 'delegations-indexer';
import { env } from '../../../env.js';

export type RedeemedCreditLinesParams = {
  delegator?: string;
  delegate?: string;
  chainId: number;
};

export type RedeemedCreditLinesReturnType =
  | {
      ok: true;
      creditLines: RedeemedCreditLinesResponse;
    }
  | {
      ok: false;
      error: string;
      creditLines?: never;
    };

export async function getRedeemedCreditLines({
  chainId,
  delegate,
  delegator,
}: RedeemedCreditLinesParams): Promise<RedeemedCreditLinesReturnType> {
  const redeemedCreditLinesUrl = new URL(
    `${env.DELEGATIONS_INDEXER_API_URL}/redeemed-credit-lines`,
  );

  redeemedCreditLinesUrl.searchParams.append('chainId', chainId.toString());
  if (delegate) {
    redeemedCreditLinesUrl.searchParams.append('delegate', delegate);
  }
  if (delegator) {
    redeemedCreditLinesUrl.searchParams.append('delegator', delegator);
  }

  const res = await fetch(redeemedCreditLinesUrl);

  if (!res.ok) {
    console.log('res', res.statusText);
    return { ok: false, error: 'Error fetching credit lines' };
  }

  const creditLines: RedeemedCreditLinesResponse = await res.json();

  return { ok: true, creditLines };
}
