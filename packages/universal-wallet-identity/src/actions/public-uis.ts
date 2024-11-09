import type { Account, Chain, Client, Transport } from "viem";
import {
	type ResolveUisParameters,
	type ResolveUisReturnType,
	resolveUis,
} from "./resolve-uis.js";
import {
	type SignDidDocumentParameters,
	type SignDidDocumentReturnType,
	signDidDocument,
} from "./sign-did-document.js";

export type PublicActionsUis = {
	resolveUis: (
		parameters: ResolveUisParameters,
	) => Promise<ResolveUisReturnType>;
	signDidDocument: (
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
			resolveUis: (args) => resolveUis(client, args),
			signDidDocument: async (args) => signDidDocument(client, args),
		};
	};
}
