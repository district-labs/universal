import { useMutation } from "@tanstack/react-query";
import type { UniversalIdentityApiClient } from "api-identity";
import { useUniversalIdentityClient } from "../client.js";

type InsertUniversalDidParams = Parameters<
	UniversalIdentityApiClient["index"]["$post"]
>[0]["json"];

export async function insertUniversalDid(
	UniversalDidApiClient: UniversalIdentityApiClient,
	data: InsertUniversalDidParams,
) {
		const res = await UniversalDidApiClient.index.$post({
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

export function useInsertUniversalDid() {
	const UniversalDidApiClient = useUniversalIdentityClient();
	return useMutation({
		mutationFn: (data: InsertUniversalDidParams) =>
			insertUniversalDid(UniversalDidApiClient, data),
	});
}
