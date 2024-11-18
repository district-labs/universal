import DiscordIcon from '@/assets/brands/discord.svg';
import GithubIcon from '@/assets/brands/github.svg';
import XIcon from '@/assets/brands/x.svg';
import { SvgIcon } from '@/components/core/svg-icon';
import type * as React from 'react';

type CredentialSocialIconProps = React.HTMLAttributes<HTMLElement> & {
  size: number;
  type: 'x' | 'github' | 'discord';
};

export const CredentialSocialIcon = ({ className, type, size = 18 }: CredentialSocialIconProps) => {
  if (type === 'x') {
    return (
      <SvgIcon
        className={className}
        src={XIcon}
        height={size}
        width={size}
        color="black"
      />
    );
  }

  if (type === 'github') {
    return (
      <SvgIcon
        className={className}
        src={GithubIcon}
        height={size}
        width={size}
        color="#3e3e3e"
      />
    );
  }

  if (type === 'discord') {
    return (
      <SvgIcon
        className={className}
        src={DiscordIcon}
        height={size}
        width={size}
        color="#3e3e3e"
      />
    );
  }

  return null;
};

