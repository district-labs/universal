export type SocialCredential = {
  id: number;
  issuer: string;
  subject: string;
  type: string;
  category: string;
  credential: {
    type: string[];
    proof: {
      jwt: string;
      type: string;
    };
    issuer: {
      id: string;
    };
    '@context': string[];
    issuanceDate: string;
    credentialSubject: {
      id: string;
      handle: string;
      platform: string;
      verifiedAt: string;
      platformUserId: string | number;
      platformProfileUrl: string;
    };
  };
};
