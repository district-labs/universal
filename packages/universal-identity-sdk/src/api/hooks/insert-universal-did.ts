import { useMutation } from "@tanstack/react-query";
import type { IdentityApiClient } from "../client.js";

type InsertUniversalDidParams = Parameters<
	IdentityApiClient["index"]["$post"]
>[0]["json"];

export async function insertUniversalDid(
	universalDidApiClient: IdentityApiClient,
	data: InsertUniversalDidParams,
) {
	const res = await universalDidApiClient.index.$post({
		json: data,
	});

	if (!res.ok) {
		const { error } = await res.json();
		throw new Error(error);
	}

	const { message } = await res.json();
	return {
		message,
	};
}

export function useInsertUniversalDid(
	universalDidApiClient: IdentityApiClient,
) {
	return useMutation({
		mutationFn: (data: InsertUniversalDidParams) =>
			insertUniversalDid(universalDidApiClient, data),
	});
}
