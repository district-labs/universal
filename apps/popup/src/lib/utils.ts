import { isAddress } from 'viem';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(input: string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function truncateEthAddress(address: string) {
  return `${address?.slice(0, 6)}...${address?.slice(-4)}`;
}

export function formatAccount(account: string) {
  if (isAddress(account)) {
    return truncateEthAddress(account);
  }

  return account;
}

export function formatNumber(
  input: number | bigint | string | undefined | null,
  decimals = 2,
  maxDecimals?: number,
): string {
  if (input === undefined || input === null) {
    return '0';
  }
  if (typeof input === 'string') {
    input = parseFloat(input);
  }
  if (typeof input === 'bigint') {
    input = Number(input);
  }
  if (input === 0) {
    return '0';
  }

  // Determine the number of decimal places based on the magnitude of the number
  let dynamicDecimals = decimals;
  if (Math.abs(input) < 0.01) {
    const magnitude = Math.ceil(-Math.log10(Math.abs(input)));
    dynamicDecimals = Math.max(decimals, magnitude);
  }

  // Apply maxDecimals if it is provided
  if (maxDecimals !== undefined) {
    dynamicDecimals = Math.min(dynamicDecimals, maxDecimals);
  }

  // Round the number to the effective number of decimal places
  const roundedInput = parseFloat(input.toFixed(dynamicDecimals));

  // If the rounded value is 0, return "0"
  if (roundedInput === 0) {
    return '0';
  }

  // Use toFixed for small numbers to avoid scientific notation
  if (Math.abs(input) < 1e-6) {
    return input.toFixed(dynamicDecimals);
  }

  // For numbers less than 0.01 but not zero, keep up to two significant digits
  if (Math.abs(input) < 0.01) {
    // Convert to string with two significant digits, then parse as a float to remove trailing zeros
    return parseFloat(input.toPrecision(decimals)).toString();
  }

  // For numbers 0.01 and above, format to two decimal places with commas
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(input);
}

export function formatUsd(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}
