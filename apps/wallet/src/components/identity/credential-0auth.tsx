import { cn } from '@/lib/utils';
import type * as React from 'react';
import { useVerificationRequestSign } from 'universal-identity-sdk';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';

type Credential0Auth = React.HTMLAttributes<HTMLElement> & {
  type: string;
  icon: React.ReactNode;
  title: string;
  description: string;
};

const Credential0Auth = ({
  className,
  type,
  icon,
  title,
  description,
}: Credential0Auth) => {
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
          onClick={async ()=> {
            const signature = await signVerificationRequestAsync({
              id: 'dis:uis:84532:0x305f57c997A35E79F6a59CF09A9d07d2408b5935:0xAa8201ec154Aa4869A974C62B3eAB0404d67653b',
              type: type
            })
            console.log('Signature:', signature)
          }}
        >
          Claim Credential
        </Button>
      </CardFooter>
    </Card>
  );
};
export { Credential0Auth };
