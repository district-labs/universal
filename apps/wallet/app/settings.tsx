'use client';

import DiscordIcon from '@/assets/brands/discord.svg';
import GithubIcon from '@/assets/brands/github.svg';
import XIcon from '@/assets/brands/x.svg';
import { SvgIcon } from '@/components/core/svg-icon';

export const CREDENTIAL_OPTIONS = [
  {
    type: 'x',
    icon: <SvgIcon src={XIcon} height={42} width={42} color="black" />,
    iconSmall: <SvgIcon src={XIcon} height={16} width={16} color="black" />,
    title: 'X (Formerly Twitter)',
    description: 'Verify your X account.',
  },
  {
    type: 'github',
    icon: <SvgIcon src={GithubIcon} height={42} width={42} color="#3e3e3e" />,
    iconSmall: (
      <SvgIcon src={GithubIcon} height={16} width={16} color="#3e3e3e" />
    ),
    title: 'Github',
    description: 'Verify your Github account.',
  },
  {
    type: 'discord',
    icon: <SvgIcon src={DiscordIcon} height={42} width={42} color="#3e3e3e" />,
    iconSmall: (
      <SvgIcon src={DiscordIcon} height={16} width={16} color="#3e3e3e" />
    ),
    title: 'Discord',
    description: 'Verify your Discord account.',
  },
];
