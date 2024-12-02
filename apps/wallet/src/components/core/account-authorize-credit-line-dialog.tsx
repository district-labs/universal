import { FormErc20Authorize } from '@/components/forms/form-erc20-authorize';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { credentialsApiClient } from '@/lib/api-credentials/client';
import type * as React from 'react';
import { useGetCredentials } from 'universal-credential-sdk';
import { universalDeployments } from 'universal-data';
import { constructDidIdentifier } from 'universal-identity-sdk';
import type { Address } from 'viem';
import { CredentialSocialIcon } from '../identity/credential-social-icon';
import { LinkComponent } from '../ui/link-component';

type AccountInteractDialogProps = React.HTMLAttributes<HTMLElement> & {
  address: Address;
  chainId: number;
};

export const AccountInteractDialog = ({
  address,
  children,
  chainId,
}: AccountInteractDialogProps) => {
  const credentialsQuery = useGetCredentials(credentialsApiClient, {
    did: constructDidIdentifier({
      chainId,
      address,
      resolver: universalDeployments.Resolver,
    }),
  });

  return (
    <Dialog>
      <DialogTrigger asChild={true}>{children}</DialogTrigger>
      <DialogContent className="grid grid-cols-1 overflow-hidden p-0 md:max-w-screen-lg md:grid-cols-5">
        <div className="gap-x-5 bg-neutral-100 p-6 md:col-span-2">
          <DialogHeader className="text-left sm:text-left">
            <DialogTitle className="font-black text-4xl">
              <span className="block font-semibold text-2xl text-neutral-500">
                Credit Line
              </span>
              <h4>Authorization</h4>
            </DialogTitle>
          </DialogHeader>
          <h3 className="mt-6 font-semibold text-lg">Social Accounts</h3>
          <hr className=" my-4" />
          <div className="space-y-4">
            {credentialsQuery.isLoading && <div>Loading...</div>}
            {credentialsQuery.data && credentialsQuery?.data?.length > 0 && (
              <div className="space-y-2">
                {credentialsQuery?.data?.map((credential) => (
                  <div
                    key={credential.credential.credentialSubject.id}
                    className="flex flex-row items-center gap-1"
                  >
                    <CredentialSocialIcon
                      size={14}
                      type={String(
                        credential.credential.credentialSubject.platform,
                      )}
                    />
                    <LinkComponent
                      href={String(
                        credential.credential.credentialSubject
                          .platformProfileUrl,
                      )}
                      className="font-normal text-base"
                    >
                      {String(credential.credential.credentialSubject.handle)}
                    </LinkComponent>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col space-y-4 p-4 md:col-span-3 md:p-10">
          <FormErc20Authorize
            tokenAddress={'0xE3Cfc3bB7c8149d76829426D0544e6A76BE5a00B'}
            defaultValues={{
              to: address,
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
