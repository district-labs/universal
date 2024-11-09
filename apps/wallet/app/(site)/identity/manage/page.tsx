'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { useAccount, usePublicClient } from 'wagmi';
import { publicActionsUis, resolveUis } from 'universal-identity-sdk';

export default function IdentityManagePage() {
  const client = usePublicClient();
  const {address} = useAccount();

  const [document, setDocument] = React.useState<string>();
  if(!client || !address) return null;
  React.useEffect(() => {
    resolveUis(client, {
      resolver: '0xDdf04F5b174834C91142b121bd982B50532695e0',
      address: address,
    })
      .then((document) => {
        const _document = JSON.parse(document);
        console.log(_document, '_document_document');
        setDocument(_document);
        return;
      })
      .catch((error) => {
        console.error(error);
        return;
      });
  }, [client]);

  console.log(document, 'document');

  return (
    <section>
      <div className={cn('container', 'mx-auto', 'px-4', 'py-16')}>
        <div
          className={cn('flex', 'flex-col', 'items-center', 'justify-center')}
        >
          <h1 className={cn('text-3xl font-bold text-center mb-4')}>
            Universal Identity
          </h1>

          {
            document && <div className="max-h-[520px] h-full bg-neutral-100 flex-1 p-8 text-sm overflow-auto max-w-screen-md rounded-xl shadow-xl border-2">
              <pre className="font-mono text-xs pb-4">{`${JSON.stringify(document, null, 2)}`}</pre>
            </div>
          }
        </div>
      </div>
    </section>
  );
}
