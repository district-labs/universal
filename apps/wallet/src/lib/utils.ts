import { type ClassValue, clsx } from 'clsx';
import { DateTime, Duration } from 'luxon';
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

export function trimFormattedBalance(
  balance: string | undefined,
  decimals = 4,
) {
  if (!balance) {
    return '0';
  }
  const [integer, decimal] = balance.split('.');
  if (!decimal) {
    return integer;
  }

  const trimmedDecimal = decimal.slice(0, decimals);
  return `${integer}.${trimmedDecimal}`;
}

export function truncateEthAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatPercent(
  input: number | string | undefined,
  decimals = 2,
) {
  let number = input;
  if (number === undefined || number === null) {
    return '0';
  }
  if (typeof number === 'string') {
    number = Number.parseFloat(number);
  }
  if (Number.isNaN(number)) {
    return '0.00%';
  }
  const formattedPercent = `${(number * 100).toFixed(decimals)}%`;

  return formattedPercent === '0.00%' && number > 0
    ? '<0.01%'
    : formattedPercent;
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

export function formatNumberCompact(input: number | bigint | string) {
  return Intl.NumberFormat('en', { notation: 'compact' }).format(Number(input));
}

export function formatTokenPrice({
  amount,
  decimals = 2,
  price,
  value,
}: {
  amount: number | string;
  decimals?: number;
  price?: string | number | null;
  value?: string | number | null;
}) {
  if (price === undefined && value === undefined) {
    throw new Error('Either price or value must be defined');
  }

  if (price === null || value === null) {
    return 'N/A';
  }

  const amountFloat =
    typeof amount === 'string' ? Number.parseFloat(amount) : amount;
  return formatNumber(
    price === undefined ? Number(value) : amountFloat * Number(price),
    decimals,
    decimals,
  );
}

/**
 * Format an account address or ENS name for display.
 * @param account The account address or ENS name to format.
 */
export function formatAccount(account: string) {
  if (isAddress(account)) {
    return truncateEthAddress(account);
  }

  return account;
}

export function chunkArray<T>({ array, size }: { array: T[]; size: number }) {
  const chunked_arr = [];
  let index = 0;
  while (index < array.length) {
    chunked_arr.push(array.slice(index, size + index));
    index += size;
  }
  return chunked_arr;
}

/**
 * Utility function to check if two ethereum addresses are equal regardless of checksum.
 * Also trims whitespaces.
 */
export function isEqualAddress(a: string | undefined, b: string | undefined) {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export function isValidString(input: unknown): input is string {
  return typeof input === 'string' && input.length > 0;
}

export function getTimeFromEpoch(epoch: number) {
  return DateTime.fromSeconds(Number(epoch)).toLocaleString(
    DateTime.DATETIME_MED,
  );
}

export function formatTimeDifference(startEpoch: number, endEpoch: number) {
  const duration = endEpoch - startEpoch;

  return Duration.fromObject({
    days: Math.floor(duration / 86400),
    hours: Math.floor((duration % 86400) / 3600),
    minutes: Math.floor((duration % 3600) / 60),
  }).toHuman({ notation: 'compact' });
}

export function formatTimeDifferenceToObject(
  startEpoch: number,
  endEpoch: number,
) {
  const duration = endEpoch - startEpoch;

  return Duration.fromObject({
    days: Math.floor(duration / 86400),
    hours: Math.floor((duration % 86400) / 3600),
    minutes: Math.floor((duration % 3600) / 60),
  });
}

export function isAndroid(): boolean {
  return (
    typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent)
  );
}

export function isSmallIOS(): boolean {
  return (
    typeof navigator !== 'undefined' && /iPhone|iPod/.test(navigator.userAgent)
  );
}

export function isLargeIOS(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    (/iPad/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))
  );
}

export function isIOS(): boolean {
  return isSmallIOS() || isLargeIOS();
}

export function isMobile(): boolean {
  return isAndroid() || isIOS();
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function formatIpfsGatewayUrl(image: string | undefined) {
  if (typeof image === 'undefined') {
    return '/images/protocols/unknown.png';
  }

  return image.replace('ipfs://', 'https://ipfs.io/ipfs/');
}
