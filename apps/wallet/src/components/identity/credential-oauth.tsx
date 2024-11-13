import { cn } from '@/lib/utils';
import { useState, type HTMLAttributes, type ReactNode } from 'react';
import { useVerificationRequestSign } from 'universal-identity-sdk';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';

type CredentialOAuth = HTMLAttributes<HTMLElement> & {
  type: string;
  icon: ReactNode;
  title: string;
  description: string;
};

const CredentialOAuth = ({
  className,
  type,
  icon,
  title,
  description,
}: CredentialOAuth) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signVerificationRequestAsync } = useVerificationRequestSign()
  return (
    <Card className={cn('p-0', className)}>
      <CardHeader className="pb-2">{icon}</CardHeader>
      <CardContent>
        <h3 className="font-bold text-2xl">{title}</h3>
        <p className="mt-2 text-sm">{description}</p>
      </CardContent>
      <CardFooter className=" w-full border-t-2 px-4 py-4">
        <Button
          className='w-full font-bold text-base'
          rounded={'full'}
          variant="default"
          size="lg"
          disabled={isLoading}
          onClick={async () => {
            setIsLoading(true);
            const did = 'did:uis:84532:0x305f57c997A35E79F6a59CF09A9d07d2408b5935:0xAa8201ec154Aa4869A974C62B3eAB0404d67653b'
            const signature = await signVerificationRequestAsync({
              id: did,
              type
            })

            router.push(`http://localhost:8787/verify/${type}/${did}/${signature}/${window.location.href ? encodeURIComponent(window.location.href) : ''}`);
            setIsLoading(false);
          }}
        >
          Claim Credential
        </Button>
      </CardFooter>
    </Card>
  );
};
export { CredentialOAuth };
