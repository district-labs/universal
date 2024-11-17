'use client';

import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';
import { isAddress } from 'viem';

interface QRCodeGenerate {
  data?: string;
  size?: number;
  logoSize?: number;
  className?: string;
}

export function QRCodeGenerate({
  data,
  size = 256,
  logoSize = 46,
  className,
}: QRCodeGenerate) {
  const [logoUrl, setLogoUrl] = useState('/images/eth-qr.png');
  const [isValid, setIsValid] = useState(false);
  const [qrValue, setQrValue] = useState('');

  useEffect(() => {
    if (data && isAddress(data)) {
      setIsValid(true);
      setQrValue(`ethereum:${data}`);
      setLogoUrl('/images/eth-qr.png');
    } else if (data?.startsWith('did:uis')) {
      setIsValid(true);
      setQrValue(`${data}`);
      setLogoUrl('/images/qr-id-dark.png');
    } else {
      setIsValid(false);
      setQrValue('invalid');
    }
  }, [data]);

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
