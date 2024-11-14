import { env } from '@/env';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { type HTMLAttributes, type ReactNode, useState } from 'react';
import { useVerificationRequestSign } from 'universal-identity-sdk';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';

type CredentialOAuth = HTMLAttributes<HTMLElement> & {
  type: string;
  icon: ReactNode;
  title: string;
  did: string | undefined;
  description: string;
};

export const CredentialOAuth = ({
  className,
  did,
  type,
  icon,
  title,
  description,
}: CredentialOAuth) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signVerificationRequestAsync } = useVerificationRequestSign();
  return (
    <Card className={cn('p-0', className)}>
      <CardHeader className="pb-2">{icon}</CardHeader>
      <CardContent>
        <h3 className="font-bold text-2xl">{title}</h3>
        <p className="mt-2 text-sm">{description}</p>
      </CardContent>
      <CardFooter className=" w-full border-t-2 px-4 py-4">
        <Button
          className="w-full font-bold text-base"
          rounded={'full'}
          variant="default"
          size="lg"
          disabled={isLoading || !did}
          onClick={async () => {
            if (!did) {
              return;
            }
            setIsLoading(true);
            const signature = await signVerificationRequestAsync({
              id: did,
              type,
            });
            router.push(
              `${env.NEXT_PUBLIC_CREDENTIALS_API_URL}/verify/${type}/${did}/${signature}/${window.location.href ? encodeURIComponent(window.location.href) : ''}`,
            );
            setIsLoading(false);
          }}
        >
          Claim Credential
        </Button>
      </CardFooter>
    </Card>
  );
};
