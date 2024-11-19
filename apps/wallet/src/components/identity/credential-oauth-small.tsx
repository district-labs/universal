import { env } from '@/env';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { type HTMLAttributes, type ReactNode, useState } from 'react';
import { useVerificationRequestSign } from 'universal-identity-sdk';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

type CredentialOAuthSmallProps = HTMLAttributes<HTMLElement> & {
  type: string;
  iconSmall: ReactNode;
  title: string;
  did: string | undefined;
  description: string;
  credential: {
    category: string;
    type: string;
    issuer: string;
    subject: string;
    credential: {
      '@context': string;
      type: string[];
      issuer: string;
      issuanceDate: string;
      expirationDate: string;
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      credentialSubject: any;
    };
  };
};

export const CredentialOAuthSmall = ({
  className,
  did,
  type,
  iconSmall,
  title,
  description,
  credential,
}: CredentialOAuthSmallProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signVerificationRequestAsync } = useVerificationRequestSign();

  return (
    <Card className={cn('p-0', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs">
          {iconSmall}
          {description}
        </div>
        <div className="">
          {!credential && (
            <>
              <Button
                rounded={'full'}
                variant="default"
                size="sm"
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
                Verify
              </Button>
            </>
          )}
          {credential && (
            <>
              <Button
                rounded={'full'}
                variant="emerald"
                size="sm"
                disabled={isLoading || !did}
              >
                Verified
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};
