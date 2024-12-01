import { universalDeployments } from 'universal-data';
import { constructDidIdentifier } from 'universal-identity-sdk';
import type { Address } from 'viem';
import { apiCredentialsClient } from '../../../clients.js';

type Credential = Exclude<
  Awaited<
    ReturnType<
      Awaited<
        ReturnType<(typeof apiCredentialsClient)['credentials']['$post']>
      >['json']
    >
  >,
  { error: string }
>['credentials'][number];

export type GetCredentialsByAddressesParams = {
  addresses: Address[];
  chainId: number;
};
export type GetCredentialsByAddressesReturnType = {
  credentials: {
    [address: string]: Credential | undefined;
  };
};

/**
 * Receives an array of addresses and returns the credentials associated with them in form of an
 * object where the key is the address and the value is the credentials.
 */
export async function getCredentialsByAddresses({
  addresses,
  chainId,
}: GetCredentialsByAddressesParams): Promise<GetCredentialsByAddressesReturnType> {
  const resolver = universalDeployments?.[chainId]?.resolver;

  if (!resolver) {
    throw new Error(`No resolver found for chainId ${chainId}`);
  }

  // Uses a Set to remove duplicates
  const filteredAddresses = Array.from(new Set(addresses));

  const dids = filteredAddresses.map((address) =>
    constructDidIdentifier({
      chainId,
      address,
      resolver,
    }),
  );

  const credentialsRes = await apiCredentialsClient.credentials.$post({
    json: {
      dids,
    },
  });

  if (!credentialsRes.ok) {
    throw new Error('Error fetching credentials');
  }

  const { credentials } = await credentialsRes.json();

  // Construct the credentials object
  const credentialsObject = filteredAddresses.reduce(
    (acc, address) => {
      const did = constructDidIdentifier({ chainId, address, resolver });

      const addressCredential: Credential | undefined = credentials.find(
        (credential) => credential.did === did,
      );
      acc[address] = addressCredential;

      return acc;
    },
    {} as GetCredentialsByAddressesReturnType['credentials'],
  );

  return {
    credentials: credentialsObject,
  };
}
