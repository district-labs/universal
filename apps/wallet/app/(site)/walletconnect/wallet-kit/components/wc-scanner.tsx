'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { type IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import { Focus, SwitchCamera } from 'lucide-react';
import { useCallback, useState } from 'react';


// WalletConnect Scanner
export function WcScanner() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState<string>();
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>(
    'environment',
  );

  // Handle QR code decoding
  const handleDecode = useCallback((result: IDetectedBarcode[]) => {
    console.log("result: ", result);
    setValue(result[0].rawValue);
  }, []);

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
      <DialogContent
        className="max-w-sm transition-all md:max-w-lg"
      >
        <DialogHeader className="items-center text-center" />
        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) :
          value ? (
            <div>
              Value: {value}
            </div>
          )
            : (
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
