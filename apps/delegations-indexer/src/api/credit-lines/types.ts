export type CreditLineResponse = {
  creditLines: {
    delegation: {
      hash: string;
      delegator: string;
    };
    token: string;
    limit: string;
    totalSpent: string;
    redemptions: {
      timestamp: string;
      redeemed: string;
    }[];
  }[];
};
