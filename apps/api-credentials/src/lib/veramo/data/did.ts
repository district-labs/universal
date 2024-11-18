import { alias } from '../agent.js';

if (!process.env.DID_PUB_KEY) {
  throw new Error('DID_PUB_KEY env var is required');
}

const didPubKey = process.env.DID_PUB_KEY;

export const webDid = {
  '@context': [
    'https://www.w3.org/ns/did/v1',
    'https://w3id.org/security/v2',
    'https://w3id.org/security/suites/secp256k1recovery-2020/v2',
  ],
  id: `did:web:${alias}`,
  verificationMethod: [
    {
      id: `did:web:${alias}#${didPubKey}`,
      type: 'EcdsaSecp256k1VerificationKey2019',
      controller: `did:web:${alias}`,
      publicKeyHex: didPubKey,
    },
  ],
  authentication: [
    `did:web:${alias}#${didPubKey}`,
  ],
  assertionMethod: [
    `did:web:${alias}#${didPubKey}`,
  ],
  keyAgreement: [],
  service: [],
};
