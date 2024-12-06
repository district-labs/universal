import { useToast } from '@/lib/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Copy } from 'lucide-react';
import type * as React from 'react';
import { useCopyToClipboard } from 'usehooks-ts';

type CopyIconButton = React.HTMLAttributes<HTMLElement> & {
  value: string;
};

const CopyIconButton = ({ className, value }: CopyIconButton) => {
  const { toast } = useToast();
  const [, copy] = useCopyToClipboard();

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
    <span
      className={cn('cursor-pointer p-0', className)}
      onClick={() => handleCopy(value)}
    >
      <Copy className="size-4 cursor-pointer" height={8} width={8} />
      <span className="sr-only">Copy</span>
    </span>
  );
};
export { CopyIconButton };
