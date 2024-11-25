import type { DelegationDb } from "api-delegations";

export type Token = {
	address: string;
	name: string;
	symbol: string;
	img: string;
	decimals: number;
};

export type TokenItem = {
	name: string;
	address: string;
	symbol: string;
	decimals: number;
	chainId: number;
	logoURI: string;
	tags?: string[];
	extensions?: {
		bridgeInfo?:
		| {
			[key: string]:
			| {
				tokenAddress: string;
			}
			| undefined;
		}
		| undefined;
	};
};

export type TokenList = {
	name: string;
	logoURI: string;
	keywords: string[];
	tags: {
		[key: string]: {
			name: string;
			description: string;
		};
	};
	timestamp: string;
	tokens: TokenItem[];
	version: {
		major: number;
		minor: number;
		patch: number;
	};
};

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
		"@context": string[];
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

export type DelegationExecutions = {
	delegation: DelegationDb;
	execution: {
		hash: string;
		amount: bigint;
		amountFormatted: string;
		total: bigint;
		totalFormatted: string;
		spentMapAfter: bigint;
		spentMapAfterFormatted: string;
	};
	token: {
		name: string;
		symbol: string;
		decimals: number;
	};
};

export type DelegationWithMetadata = {
	data: DelegationDb;
	metadata: {
		available: {
			amount: string;
			amountFormatted: string;
		};
		spent: {
			amount: string;
			amountFormatted: string;
		};
		limit: {
			amount: string;
			amountFormatted: string;
		};
		token: TokenItem;
	};
};
