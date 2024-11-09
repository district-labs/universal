import { type Hex, encodeAbiParameters } from "viem";

export function encodeDidResponse({
  document,
  signature,
  status,
}: {
  document: string;
  signature: Hex;
  status: number;
}) {
  return encodeAbiParameters(
    [
      { name: "status", type: "uint16" },
      { name: "signature", type: "bytes" },
      { name: "document", type: "string" },
    ],
    [status, signature, document],
  );
}
