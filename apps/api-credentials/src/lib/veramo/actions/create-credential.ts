import { alias, veramoAgent } from '../agent.js';

type Platform = 'x' | 'github' | 'discord';

type CreateCredentialParams = {
  credentialSubject: {
    id: string;
    platform: Platform;
    platformUserId: string;
    handle: string;
    verifiedAt: string;
    platformProfileUrl: string;
    platformProfileImageUrl: string | undefined;
  };
};
export async function createCredential({
  credentialSubject,
}: CreateCredentialParams) {
  const identifier = await veramoAgent.didManagerGetByAlias({ alias });

  const verifiableCredential = await veramoAgent.createVerifiableCredential({
    proofFormat: 'jwt',
    credential: {
      issuer: {
        id: identifier.did,
      },
      credentialSubject,
    },
  });
  return verifiableCredential;
}
