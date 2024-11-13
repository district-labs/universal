export const universalDocumentAbi = [
	{
		type: "function",
		name: "generate",
		inputs: [
			{ name: "router", type: "address", internalType: "address" },
			{ name: "account", type: "address", internalType: "address" },
		],
		outputs: [{ name: "", type: "string", internalType: "string" }],
		stateMutability: "view",
	},
	{
		type: "error",
		name: "StringsInsufficientHexLength",
		inputs: [
			{ name: "value", type: "uint256", internalType: "uint256" },
			{ name: "length", type: "uint256", internalType: "uint256" },
		],
	},
] as const;
