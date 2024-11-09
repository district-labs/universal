import { isAddress, isHex } from "viem";
import { z } from "zod";
import { chains } from "../config/chains.js";

export const addressSchema = z.string().refine(isAddress, {
  message: "Invalid address",
});

export const hexSchema = z.string().refine(isHex, {
  message: "Invalid hex",
});

export const chainIdSchema = z
  .number()
  .refine((value) => chains.some(({ id }) => id === value), {
    message: "Invalid chain ID",
  });
