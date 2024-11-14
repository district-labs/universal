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
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import { Focus, SwitchCamera } from 'lucide-react';
import { useCallback, useState } from 'react';
import { z } from 'zod';
import { CopyIconButton } from './copy-icon-button';
import { Card } from './ui/card';

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
    return { chainId, resolver, account };
  });

// Scanner Component
export function ScannerIconDialog() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scannedResult, setScannedResult] = useState<{
    type: 'address' | 'did' | 'unknown';
    data: any;
  } | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>(
    'environment',
  );

  // Handle QR code decoding
  const handleDecode = useCallback((result: IDetectedBarcode[]) => {
    console.log(result[0].rawValue);
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
        data: didResult.data,
      });
      return;
    }

    // If neither matches, set as unknown
    setScannedResult({ type: 'unknown', data: result });
  }, []);

  // Handle errors from QR scanner
  const handleError = (error: Error) => {
    setError(
      'Failed to access camera. Please make sure you have granted camera permissions.',
    );
    console.error(error);
  };

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
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <span>
            <Focus width={24} height={24} className="size-8 text-lg" />
            <span className="sr-only">Open QR scanner</span>
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn('md:max-w-lg transition-all max-w-sm', {
          'md:max-w-2xl ': scannedResult?.type === 'address',
        })}
      >
        <DialogHeader className="text-center items-center" />
        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : scannedResult ? (
          <div className="p-4 rounded-lg w-full">
            {/* <h3 className="font-semibold mb-2">Scanned Result:</h3> */}
            <Card className="p-8 break-anywhere">
              {scannedResult.type === 'address' && (
                <>
                  <h3 className="font-semibold text-lg">Ethereum Address</h3>
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
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
          <div className="relative w-full h-[min-content] md:min-h-[455px] overflow-hidden rounded-lg bg-muted">
            <Scanner
              styles={{ finderBorder: 3 }}
              classNames={{
                container: 'object-cover w-full h-full',
                video: 'object-cover w-full h-full',
              }}
              onScan={handleDecode}
              constraints={{ facingMode }}
            />
            <div className="absolute inset-0 border-[3px] border-white/50 rounded-lg" />
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
