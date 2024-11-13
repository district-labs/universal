'use client';

import DiscordIcon from '@/assets/brands/discord.svg';
import GithubIcon from '@/assets/brands/github.svg';
import XIcon from '@/assets/brands/x.svg';
import { CredentialOAuth } from '@/components/identity/credential-oauth';
import { SvgIcon } from '@/components/svg-icon';

const CREDENTIAL_OPTIONS = [
  {
    type: 'x',
    icon: <SvgIcon src={XIcon} height={42} width={42} color="black" />,
    title: 'X (Formerly Twitter)',
    description:
      'Verify your X account.',
  },
  {
    type: 'github',
    icon: <SvgIcon src={GithubIcon} height={42} width={42} color="#3e3e3e" />,
    title: 'Github',
    description:
      'Verify your Github account.',
  },
  {
    type: 'discord',
    icon: <SvgIcon src={DiscordIcon} height={42} width={42} color="purple" />,
    title: 'Discord',
    description:
      'Verify your Discord account.',
  },
];

export default function IdentityCredentialsPage() {
  return (
    <>
      <section className="border-b-2 bg-neutral-100 py-6">
        <div className="container mx-auto max-w-screen-xl py-10">
          <h3 className="font-bold text-3xl">Universal Credentials</h3>
          <p className="">
            Unlock the full potential of your online identity with universal
            credentials.
          </p>
        </div>
      </section>
      <section className="py-8">
        <div className='mx-auto grid max-w-screen-xl grid-cols-1 gap-x-5 lg:grid-cols-3'>
          {CREDENTIAL_OPTIONS.map((credential) => (
            <CredentialOAuth
              {...credential}
              key={credential.title}
              className="mb-6"
            />
          ))}
        </div>
      </section>
    </>
  );
}
