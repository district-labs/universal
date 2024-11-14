import { veramoAgent } from '../agent.js';

type VerifyCredentialParams = {
  // TODO: Process credential correctly
  // biome-ignore lint/suspicious/noExplicitAny: any
  credential: any;
};
export function verifyCredential({ credential }: VerifyCredentialParams) {
  return veramoAgent.verifyCredential({
    credential,
  });
}
