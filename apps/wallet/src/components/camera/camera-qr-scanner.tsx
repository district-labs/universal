'use client';
import WalletConnectIcon from '@/assets/brands/walletconnect.svg';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/lib/hooks/use-toast';
import { cn } from '@/lib/utils';
import { didUriSchema, ethereumUriSchema } from '@/lib/validation/utils';
import { useConnectWc } from '@/lib/walletconnect/hooks/use-wc-connect';
import { ScanQrCode, SwitchCamera } from 'lucide-react';
import { useState } from 'react';
import ReactQrReader from 'react-qr-reader-es6';
import { SvgIcon } from '../core/svg-icon';
import { Input } from '../ui/input';

type CameraQrScannerProps = {
  className?: string;
  onScanSuccess?: (data: string) => void;
  isWalletConnectEnabled?: boolean;
};

// Scanner Component
export function CameraQrScanner({
  className,
  onScanSuccess,
  isWalletConnectEnabled,
}: CameraQrScannerProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [_error, setError] = useState<string | null>(null);
  const [scannedResult, setScannedResult] = useState<{
    type: 'address' | 'did' | 'unknown';
    data: string;
  } | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>(
    'environment',
  );
  const [uri, setUri] = useState<string | undefined>();
  const connectWcMutation = useConnectWc();

  const handleOnScan = (result?: string | null) => {
    if (!result) {
      return;
    }

    if (
      isWalletConnectEnabled &&
      connectWcMutation.connectWc &&
      result.startsWith('wc:')
    ) {
      connectWcMutation.connectWc({
        uri: result,
        onPair: async () => {
          handleOpenChange(false);
          toast({
            title: 'Application Connected',
            description: 'You have successfully connected to the application',
          });
        },
      });
      setUri('');
    }

    const ethResult = ethereumUriSchema.safeParse(result);
    if (ethResult.success) {
      onScanSuccess?.(ethResult.data.address);
      handleOpenChange(false);
      setUri('');
      return;
    }

    // Try parsing as DID
    const didResult = didUriSchema.safeParse(result);
    if (didResult.success) {
      onScanSuccess?.(didResult.data.account);
      handleOpenChange(false);
      setUri('');
      return;
    }

    // If neither matches, set as unknown
    setScannedResult({ type: 'unknown', data: '' });
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
      <DialogTrigger asChild={true}>
        <Button
          variant="outline"
          size="icon"
          className={cn('border-blue-500 text-blue-500', className)}
        >
          <span>
            <ScanQrCode width={24} height={24} className="size-8 text-lg" />
            <span className="sr-only">Open QR scanner</span>
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent
        isCloseDisabled={true}
        className={cn('max-w-sm p-0 transition-all md:max-w-lg', {
          'md:max-w-2xl ': scannedResult?.type === 'address',
        })}
      >
        <DialogHeader className="sr-only items-center text-center">
          <DialogTitle className="sr-only">Scan QR Code</DialogTitle>
        </DialogHeader>
        <div className="relative h-[min-content] w-full overflow-hidden rounded-lg bg-muted md:min-h-[455px]">
          <ReactQrReader
            showViewFinder={false}
            className="h-full w-full object-cover"
            onError={(e) => {
              setError(e.message);
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
        {isWalletConnectEnabled && (
          <div className="flex items-center gap-x-2 px-2 pb-3">
            <Input
              id="uri"
              placeholder="Enter WalletConnect URI"
              value={uri}
              onChange={(e) => setUri(e.target.value)}
            />
            <Button
              size={'icon'}
              disabled={
                !uri ||
                connectWcMutation.isPending ||
                !connectWcMutation.connectWc
              }
              onClick={() => handleOnScan(uri)}
            >
              <SvgIcon src={WalletConnectIcon} className="size-8 text-lg" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
