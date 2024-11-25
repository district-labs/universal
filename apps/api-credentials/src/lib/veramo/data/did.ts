import { env } from '../../../env.js';
import { alias } from '../agent.js';

export const webDid = {
  '@context': [
    'https://www.w3.org/ns/did/v1',
    'https://w3id.org/security/v2',
    'https://w3id.org/security/suites/secp256k1recovery-2020/v2',
  ],
  id: `did:web:${alias}`,
  verificationMethod: [
    {
      id: `did:web:${alias}#${env.DID_PUB_KEY}`,
      type: 'EcdsaSecp256k1VerificationKey2019',
      controller: `did:web:${alias}`,
      publicKeyHex: env.DID_PUB_KEY,
    },
  ],
  authentication: [`did:web:${alias}#${env.DID_PUB_KEY}`],
  assertionMethod: [`did:web:${alias}#${env.DID_PUB_KEY}`],
  keyAgreement: [],
  service: [],
};
