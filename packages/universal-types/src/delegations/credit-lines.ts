import type { DelegationWithMetadata } from './index.js';
import type { TokenItem } from '../tokens/index.js';

export type CreditLineExecutions = {
  delegation: DelegationWithMetadata;
  execution: {
    hash: string;
    amount: bigint;
    amountFormatted: string;
    total: bigint;
    totalFormatted: string;
    spentMapAfter: bigint;
    spentMapAfterFormatted: string;
  };
  token: {
    name: string;
    symbol: string;
    decimals: number;
  };
};

export type CreditLineWithMetadata = {
  data: DelegationWithMetadata;
  metadata: {
    available: {
      amount: string;
      amountFormatted: string;
    };
    spent: {
      amount: string;
      amountFormatted: string;
    };
    limit: {
      amount: string;
      amountFormatted: string;
    };
    token: TokenItem;
  };
};
