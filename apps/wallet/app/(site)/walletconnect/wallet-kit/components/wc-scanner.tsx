'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Focus, SwitchCamera } from 'lucide-react';
import { useState } from 'react';
import ReactQrReader from 'react-qr-reader-es6';

// WalletConnect Scanner
export function WcScanner({
  onScan,
}: {
  onScan: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>(
    'environment',
  );

  // Toggle camera facing mode (for smartphones)
  const switchCamera = () => {
    setFacingMode((prevMode) => (prevMode === 'user' ? 'environment' : 'user'));
  };

  // Handle dialog open/close
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
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
      <DialogContent className="max-w-sm transition-all md:max-w-lg">
        <DialogHeader className="items-center text-center" />
        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="relative h-[min-content] w-full overflow-hidden rounded-lg bg-muted md:min-h-[455px]">
            <ReactQrReader
              showViewFinder={false}
              onError={(e) => {
                console.log('error: ', e);
                setError(e);
              }}
              onScan={(result) => {
                if (!result) return;
                onScan(result);
                setOpen(false);
              }}
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