'use client';

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { isAddress, zeroAddress } from 'viem';

interface QRCodeRender {
  address?: string;
  size?: number;
  logoSize?: number;
  className?: string;
}

export function QRCodeRender({
  address = zeroAddress,
  size = 256,
  logoSize = 46,
  className,
}: QRCodeRender) {
  const [logoUrl, setLogoUrl] = useState('/images/eth-qr.png');
  const [isValid, setIsValid] = useState(false);
  const [qrValue, setQrValue] = useState('');

  useEffect(() => {
    if (isAddress(address)) {
      setIsValid(true);
      setQrValue(`ethereum:${address}`);
      setLogoUrl('/images/eth-qr.png');
    } else if (address.startsWith('did:uis')) {
      setIsValid(true);
      setQrValue(`ethereum:${address}`);
      setLogoUrl('/images/qr-id-dark.png');
    }
    {
      setIsValid(true);
      setQrValue(`ethereum:${address}`);
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
      bgColor="#FFF"
      fgColor="#3e3e3e"
      imageSettings={{
        src: logoUrl,
        x: undefined,
        y: undefined,
        height: logoSize,
        width: logoSize,
        excavate: true,
      }}
      style={{ borderRadius: '0.45rem', backgroundColor: '#3e3e3e' }}
    />
  );
}
