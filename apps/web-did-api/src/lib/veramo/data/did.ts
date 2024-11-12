export const webDid = {
	did: "did:web:web-did-api.up.railway.app",
	controllerKeyId:
		"04ed446cfec055f86e568a9b819399415df8f3d755a410754edc858c0d9b5b688e8d9a4bb1853f8ca1d80f20fa3eacbea2e198bb73d8cf2e38bbf6e0ee7779c5dc",
	provider: "did:web:web-did-api.up.railway.app",
	services: [],
	keys: [
		{
			kid: "04ed446cfec055f86e568a9b819399415df8f3d755a410754edc858c0d9b5b688e8d9a4bb1853f8ca1d80f20fa3eacbea2e198bb73d8cf2e38bbf6e0ee7779c5dc",
			type: "Secp256k1",
			kms: "local",
			publicKeyHex:
				"04ed446cfec055f86e568a9b819399415df8f3d755a410754edc858c0d9b5b688e8d9a4bb1853f8ca1d80f20fa3eacbea2e198bb73d8cf2e38bbf6e0ee7779c5dc",
			meta: {
				algorithms: [
					"ES256K",
					"ES256K-R",
					"eth_signTransaction",
					"eth_signTypedData",
					"eth_signMessage",
					"eth_rawSign",
				],
			},
		},
	],
	alias: "web-did-api.up.railway.app",
} as const;
