import type { Address } from 'viem';

export type RedeemedCreditLinesParams =
  | {
      delegator: Address;
      delegate?: never;
    }
  | {
      delegator?: never;
      delegate: Address;
    }
  | {
      delegator: Address;
      delegate: Address;
    };

export type RedeemedCreditLinesResponse = {
  creditLines: {
    delegation: {
      hash: string;
      delegator: string;
      delegate: string;
    };
    token: string;
    limit: string;
    totalSpent: string;
    redemptions: {
      transactionHash: string;
      blockNumber: number;
      timestamp: string;
      redeemed: string;
    }[];
  }[];
};
