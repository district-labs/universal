import DiscordIcon from '@/assets/brands/discord.svg';
import GithubIcon from '@/assets/brands/github.svg';
import XIcon from '@/assets/brands/x.svg';
import { cn } from '@/lib/utils';
import type { VerificationRequest } from 'universal-identity-sdk';
import { SvgIcon } from 'universal-wallet-ui';
import type { Chain } from 'viem';

type VerificationRequestDefaultParsedViewProps =
  React.HTMLAttributes<HTMLElement> & {
    chainId: Chain['id'];
    typedDataMessage: VerificationRequest;
  };

export const VerificationRequestDefaultParsedView = ({
  className,
  typedDataMessage,
}: VerificationRequestDefaultParsedViewProps) => {
  return (
    <div className={cn('flex justify-center', className)}>
      <div className="content space-y-2 py-5 text-center">
        {typedDataMessage?.type === 'x' && (
          <SvgIcon className="mx-auto" width={48} height={48} src={XIcon} />
        )}
        {typedDataMessage?.type === 'github' && (
          <SvgIcon
            className="mx-auto"
            width={48}
            height={48}
            src={GithubIcon}
          />
        )}
        {typedDataMessage?.type === 'discord' && (
          <SvgIcon
            className="mx-auto"
            color="purple"
            width={48}
            height={48}
            src={DiscordIcon}
          />
        )}
        <h3 className="font-bold text-2xl">
          {typedDataMessage?.type === 'github' && 'Github'}
          {typedDataMessage?.type === 'farcaster' && 'Farcaster'}
        </h3>
        <span className="block py-4">
          <hr className="block border-gray-200" />
        </span>
        <p className="text-sm">
          You're about to sign a verification request for{' '}
          <span className="capitalize">{typedDataMessage.type}</span>.
        </p>
        <p className="text-sm">
          Allowing the application to verify your{' '}
          <span className="capitalize">{typedDataMessage.type}</span> account.
        </p>
      </div>
    </div>
  );
};
