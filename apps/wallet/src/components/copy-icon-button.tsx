import { useToast } from '@/lib/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Copy } from 'lucide-react';
import * as React from 'react';
import { useCopyToClipboard } from 'usehooks-ts';
import { Button } from './ui/button';

type CopyIconButton = React.HTMLAttributes<HTMLElement> & {
  value: string;
};

const CopyIconButton = ({ children, className, value }: CopyIconButton) => {
  const { toast } = useToast();
  const [copiedText, copy] = useCopyToClipboard();

  const handleCopy = (text: string) => {
    copy(text)
      .then(() => {
        toast({
          title: 'Address Copied',
          description: 'The address has been copied to your clipboard',
        });
      })
      .catch((error) => {
        console.error('Failed to copy!', error);
      });
  };
  return (
    <div className={cn(className)}>
      <Button
        onClick={() => handleCopy(value)}
        variant="outline"
        size="icon"
        className="h-10 w-10"
      >
        <Copy className="h-4 w-4" />
        <span className="sr-only">Open QR scanner</span>
      </Button>
    </div>
  );
};
export { CopyIconButton };
