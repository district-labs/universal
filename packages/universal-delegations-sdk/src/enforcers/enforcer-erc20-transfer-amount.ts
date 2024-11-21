import { encodePacked, hexToBigInt, parseUnits, sliceHex, type Address, type Hex } from "viem";

export function encodeEnforcerERC20TransferAmount(data: {
    token: Address;
    amount: string;
    decimals: number;
}) {
    return encodePacked(
        [
            "address", "uint256"
        ],
        [
            data.token,
            parseUnits(data.amount, data.decimals)
        ]
    )
}

export function decodeEnforcerERC20TransferAmount(data: Hex) {
    // Addresses are 20 bytes, uint256 is 32 bytes
    const addressSize = 20;
    const uint256Size = 32;

    // Decode `token` (first 20 bytes)
    const token = sliceHex(data, 0, addressSize) as Address;

    // Decode `amount` (next 32 bytes)
    const amountHex = sliceHex(data, addressSize, addressSize + uint256Size);
    const amount = hexToBigInt(amountHex);

    return [token, BigInt(amount)] as const
}