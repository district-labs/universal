'use client';

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { isAddress, zeroAddress } from 'viem';

interface QRCodeEthereumAddress {
  address?: string;
  size?: number;
  logoUrl?: string;
  logoSize?: number;
  className?: string;
}

export function QRCodeEthereumAddress({
  address = zeroAddress,
  size = 256,
  logoUrl = '/images/eth-qr.png',
  logoSize = 46,
  className,
}: QRCodeEthereumAddress) {
  const [isValid, setIsValid] = useState(false);
  const [qrValue, setQrValue] = useState('');

  useEffect(() => {
    if (isAddress(address)) {
      setIsValid(true);
      setQrValue(`ethereum:${address}`);
    } else {
      setIsValid(false);
      console.error('Invalid Ethereum address');
    }
  }, [address]);

  if (!isValid) {
    return null;
  }

  return (
    <QRCodeSVG
      className={className}
      value={qrValue}
      size={size} // Account for padding
      level="H" // Highest error correction for logo overlay
      imageSettings={{
        src: logoUrl,
        x: undefined,
        y: undefined,
        height: logoSize,
        width: logoSize,
        excavate: true,
      }}
      style={{ borderRadius: '0.45rem' }}
    />
  );
}
