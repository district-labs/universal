import { veramoAgent, alias } from "../agent.js";

type CreateCredentialParams = {
	// TODO: Process credential correctly
	// biome-ignore lint/suspicious/noExplicitAny: any
	credentialSubject: any;
};
export async function createCredential({
	credentialSubject,
}: CreateCredentialParams) {
	const identifier = await veramoAgent.didManagerGetByAlias({ alias });

	const verifiableCredential = await veramoAgent.createVerifiableCredential({
		proofFormat: "jwt",
		credential: {
			issuer: {
				id: identifier.did,
			},
			credentialSubject,
		},
	});

	return verifiableCredential;
}
