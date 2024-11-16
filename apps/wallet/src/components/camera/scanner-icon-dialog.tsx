'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { IDetectedBarcode } from '@yudiel/react-qr-scanner';
import { Focus, SwitchCamera } from 'lucide-react';
import { useCallback, useState } from 'react';
import ReactQrReader from 'react-qr-reader-es6';
import { constructDidIdentifier } from 'universal-identity-sdk';
import type { Address } from 'viem';
import { z } from 'zod';
import { CopyIconButton } from '../copy-icon-button';
import { Card } from '../ui/card';

// Regular expression to match Ethereum URIs with optional parameters
const ethereumUriRegex = /^ethereum:(0x[a-fA-F0-9]{40})(\?(?<params>.+))?$/;

// Zod schema for Ethereum URI
const ethereumUriSchema = z
  .string()
  .regex(ethereumUriRegex, {
    message: 'Invalid Ethereum URI format',
  })
  .transform((uri) => {
    const match = uri.match(ethereumUriRegex);
    if (!match || !match.groups) {
      throw new Error('Invalid Ethereum URI format');
    }
    const address = match[1];
    const paramsString = match.groups.params || '';
    const params: Record<string, string> = {};
    // biome-ignore lint/complexity/noForEach: <explanation>
    paramsString.split('&').forEach((param) => {
      const [key, value] = param.split('=');
      if (key && value) {
        params[key] = value;
      }
    });
    return { address, params };
  });

// Regular expression to match DID format: did:uis:chainId:resolver:account
const didUriRegex = /^did:uis:([a-zA-Z0-9]+):([a-zA-Z0-9]+):0x[a-fA-F0-9]{40}$/;

// Zod schema for DIDs
const didUriSchema = z
  .string()
  .regex(didUriRegex, {
    message: 'Invalid DID format',
  })
  .transform((did) => {
    const [_, chainId, resolver, account] = did.split(':');
    return { chainId: Number(chainId), resolver, account };
  });

// Scanner Component
export function ScannerIconDialog() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scannedResult, setScannedResult] = useState<{
    type: 'address' | 'did' | 'unknown';
    data: string;
  } | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>(
    'environment',
  );

  const handleOnScan = (result?: string | null) => {
    if (!result) { return; }
    console.log(result);
  };

  // Handle QR code decoding
  const handleDecode = useCallback((result: IDetectedBarcode[]) => {
    // Try parsing as Ethereum URI
    const ethResult = ethereumUriSchema.safeParse(result[0].rawValue);
    if (ethResult.success) {
      setScannedResult({
        type: 'address',
        data: ethResult.data.address,
      });
      return;
    }

    // Try parsing as DID
    const didResult = didUriSchema.safeParse(result);
    if (didResult.success) {
      setScannedResult({
        type: 'did',
        data: constructDidIdentifier({
          chainId: didResult.data.chainId,
          resolver: didResult.data.resolver as Address,
          address: didResult.data.account as Address,
        }),
      });
      return;
    }

    // If neither matches, set as unknown
    setScannedResult({ type: 'unknown', data: '' });
  }, []);

  // Toggle camera facing mode (for smartphones)
  const switchCamera = () => {
    setFacingMode((prevMode) => (prevMode === 'user' ? 'environment' : 'user'));
  };

  // Handle dialog open/close
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setScannedResult(null);
      setError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild={true}>
        <Button variant="outline" size="icon">
          <span>
            <Focus width={24} height={24} className="size-8 text-lg" />
            <span className="sr-only">Open QR scanner</span>
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn('max-w-sm transition-all md:max-w-lg', {
          'md:max-w-2xl ': scannedResult?.type === 'address',
        })}
      >
        <DialogHeader className="items-center text-center" />
        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : scannedResult ? (
          <div className="w-full rounded-lg p-4">
            <Card className="break-anywhere p-8">
              {scannedResult.type === 'address' && (
                <>
                  <h3 className="font-semibold text-lg">Ethereum Address</h3>
                  <div className="flex flex-col gap-2 md:flex-row md:items-center">
                    <span className="block break-all text-sm">
                      {scannedResult.data}
                    </span>
                    <CopyIconButton value={scannedResult.data} />
                  </div>
                </>
              )}
              {scannedResult.type === 'did' && (
                <span className="">{scannedResult.data}</span>
              )}
            </Card>
            <Button
              className="mt-4 w-full"
              onClick={() => setScannedResult(null)}
            >
              Scan Again
            </Button>
          </div>
        ) : (
          <div className="relative h-[min-content] w-full overflow-hidden rounded-lg bg-muted md:min-h-[455px]">
            {/* <Scanner
              styles={{ finderBorder: 3 }}
              classNames={{
                container: 'object-cover w-full h-full',
                video: 'object-cover w-full h-full',
              }}
              onScan={handleDecode}
              constraints={{ facingMode }}
            /> */}
            <ReactQrReader
              showViewFinder={false}
              className='h-full w-full object-cover'
              onError={(e) => {
                console.log('error: ', e);
                setError(e);
              }}
              onScan={handleOnScan}
              facingMode={facingMode}
              style={{ width: '100%' }}
            />
            <div className="absolute inset-0 rounded-lg border-[3px] border-white/50" />
            <div className="absolute top-2 right-2">
              <Button variant="secondary" size="icon" onClick={switchCamera}>
                <SwitchCamera className="h-4 w-4" />
                <span className="sr-only">Switch camera</span>
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
