import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { isAddress } from 'viem';

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

export function truncateEthAddress(address: string, length = 6) {
  return `${address?.slice(0, length)}...${address?.slice(-length + 2)}`;
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
  let number = input;

  if (number === undefined || number === null) {
    return '0';
  }
  if (typeof number === 'string') {
    number = Number.parseFloat(number);
  }
  if (typeof number === 'bigint') {
    number = Number(number);
  }
  if (number === 0) {
    return '0';
  }

  // Determine the number of decimal places based on the magnitude of the number
  let dynamicDecimals = decimals;
  if (Math.abs(number) < 0.01) {
    const magnitude = Math.ceil(-Math.log10(Math.abs(number)));
    dynamicDecimals = Math.max(decimals, magnitude);
  }

  // Apply maxDecimals if it is provided
  if (maxDecimals !== undefined) {
    dynamicDecimals = Math.min(dynamicDecimals, maxDecimals);
  }

  // Round the number to the effective number of decimal places
  const roundedInput = Number.parseFloat(number.toFixed(dynamicDecimals));

  // If the rounded value is 0, return "0"
  if (roundedInput === 0) {
    return '0';
  }

  // Use toFixed for small numbers to avoid scientific notation
  if (Math.abs(number) < 1e-6) {
    return number.toFixed(dynamicDecimals);
  }

  // For numbers less than 0.01 but not zero, keep up to two significant digits
  if (Math.abs(number) < 0.01) {
    // Convert to string with two significant digits, then parse as a float to remove trailing zeros
    return Number.parseFloat(number.toPrecision(decimals)).toString();
  }

  // For numbers 0.01 and above, format to two decimal places with commas
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
}

export function formatUsd(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}
