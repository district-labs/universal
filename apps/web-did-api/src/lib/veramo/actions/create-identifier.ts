import { veramoAgent, provider } from "../agent.js";

export function createIdentifier() {
	const identifier = veramoAgent.didManagerGet({ did: provider });
	return identifier;
}

(async () => {
	const identifier = await createIdentifier();
	console.log(JSON.stringify(identifier));
})();
