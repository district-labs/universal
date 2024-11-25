import {
  type Account,
  type Address,
  type Chain,
  type Client,
  ClientChainNotConfiguredError,
  type Hex,
  type SignTypedDataErrorType,
  type Transport,
} from 'viem';

import { signTypedData } from 'viem/actions';
import { constructDidDocument } from '../utils/construct-did-document.js';

export type SignDidDocumentParameters = {
  address: Address;
  resolver: Address;
};

export type SignDidDocumentReturnType = Hex;

export type SignDidDocumentErrorType =
  | SignTypedDataErrorType
  | ClientChainNotConfiguredError;

/**
 *  Signs a DID document using Sign Typed Data V4.
 *
 * - Docs: TODO
 *
 * @param client - Client to use
 * @param parameters - {@link SignDidDocumentParameters}
 * @returns The prove transaction hash. {@link SignDidDocumentReturnType}
 *
 */
export async function signDidDocument<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: SignDidDocumentParameters,
): Promise<SignDidDocumentReturnType> {
  const { address, resolver } = parameters;

  if (!client.chain) {
    throw new ClientChainNotConfiguredError();
  }

  const chainId = client.chain.id;

  const didDocument = constructDidDocument({
    address,
    chainId,
    resolver,
  });

  const payload = {
    account: address,
    types: {
      UniversalDID: [
        {
          name: 'document',
          type: 'string',
        },
      ],
    },
    primaryType: 'UniversalDID',
    domain: {
      chainId,
      verifyingContract: resolver,
    },
    message: {
      document: JSON.stringify(didDocument),
    },
  } as const;

  let signature: Hex;
  const account = client.account;
  if (typeof account === 'object' && account.signTypedData) {
    signature = await account.signTypedData(payload);
  } else {
    signature = await signTypedData(client, {
      account: address,
      types: {
        UniversalDID: [
          {
            name: 'document',
            type: 'string',
          },
        ],
      },
      primaryType: 'UniversalDID',
      domain: {
        chainId,
        verifyingContract: resolver,
      },
      message: {
        document: JSON.stringify(didDocument),
      },
    });
  }

  return signature;
}
