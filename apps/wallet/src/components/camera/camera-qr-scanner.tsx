'use client';

import { CopyIconButton } from '@/components/copy-icon-button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { didUriSchema, ethereumUriSchema } from '@/lib/validation/utils';
import { type IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import { Camera, SwitchCamera } from 'lucide-react';
import { useCallback, useState } from 'react';

type CameraQrScannerProps = {
  onScanSuccess: (data: string) => void;
};

// Scanner Component
export function CameraQrScanner({ onScanSuccess }: CameraQrScannerProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scannedResult, setScannedResult] = useState<{
    type: 'address' | 'did' | 'unknown';
    data: string;
  } | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>(
    'environment',
  );

  const handleDecode = useCallback(
    (result: IDetectedBarcode[]) => {
      const ethResult = ethereumUriSchema.safeParse(result[0].rawValue);
      if (ethResult.success) {
        onScanSuccess(ethResult.data.address);
        handleOpenChange(false);
        return;
      }

      // Try parsing as DID
      const didResult = didUriSchema.safeParse(result);
      if (didResult.success) {
        onScanSuccess(didResult.data.account);
        handleOpenChange(false);
        return;
      }

      // If neither matches, set as unknown
      setScannedResult({ type: 'unknown', data: '' });
    },
    [onScanSuccess],
  );

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
            <Camera width={24} height={24} className="size-8 text-lg" />
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
            {/* <h3 className="font-semibold mb-2">Scanned Result:</h3> */}
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
            <Scanner
              styles={{ finderBorder: 3 }}
              classNames={{
                container: 'object-cover w-full h-full',
                video: 'object-cover w-full h-full',
              }}
              onScan={handleDecode}
              constraints={{ facingMode }}
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
