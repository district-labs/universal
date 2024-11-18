import { alias } from "../agent.js";

export const webDid = {
  '@context': [
    'https://www.w3.org/ns/did/v1',
    'https://w3id.org/security/v2',
    'https://w3id.org/security/suites/secp256k1recovery-2020/v2',
  ],
  id: `did:web:${alias}`,
  verificationMethod: [
    {
      id: `did:web:${alias}#04ed446cfec055f86e568a9b819399415df8f3d755a410754edc858c0d9b5b688e8d9a4bb1853f8ca1d80f20fa3eacbea2e198bb73d8cf2e38bbf6e0ee7779c5dc`,
      type: 'EcdsaSecp256k1VerificationKey2019',
      controller: `did:web:${alias}`,
      publicKeyHex:
        '04ed446cfec055f86e568a9b819399415df8f3d755a410754edc858c0d9b5b688e8d9a4bb1853f8ca1d80f20fa3eacbea2e198bb73d8cf2e38bbf6e0ee7779c5dc',
    },
  ],
  authentication: [
    `did:web:${alias}#04ed446cfec055f86e568a9b819399415df8f3d755a410754edc858c0d9b5b688e8d9a4bb1853f8ca1d80f20fa3eacbea2e198bb73d8cf2e38bbf6e0ee7779c5dc`,
  ],
  assertionMethod: [
    `did:web:${alias}#04ed446cfec055f86e568a9b819399415df8f3d755a410754edc858c0d9b5b688e8d9a4bb1853f8ca1d80f20fa3eacbea2e198bb73d8cf2e38bbf6e0ee7779c5dc`,
  ],
  keyAgreement: [],
  service: [],
};
