import type { Account, Chain, Client, Transport } from 'viem';
import {
  type ResolveUisParameters,
  type ResolveUisReturnType,
  resolveDid,
} from './resolve-did.js';
import {
  type SignDidDocumentParameters,
  type SignDidDocumentReturnType,
  signDidDocument,
} from './sign-did-document.js';

export type PublicActionsUis = {
  resolveUisDid: (
    parameters: ResolveUisParameters,
  ) => Promise<ResolveUisReturnType>;
  signUisDid: (
    parameters: SignDidDocumentParameters,
  ) => Promise<SignDidDocumentReturnType>;
};

export function publicActionsUis() {
  return <
    transport extends Transport,
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  >(
    client: Client<transport, chain, account>,
  ): PublicActionsUis => {
    return {
      resolveUisDid: (args) => resolveDid(client, args),
      signUisDid: async (args) => signDidDocument(client, args),
    };
  };
}
