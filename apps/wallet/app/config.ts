// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Site
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
interface SiteConfig {
  name: string;
  title: string;
  emoji: string;
  description: string;
  localeDefault: string;
  links?: {
    docs?: string;
    discord?: string;
    twitter?: string;
    github?: string;
  };
}

export const siteConfig: SiteConfig = {
  name: 'Universal',
  title: 'Universal',
  emoji: '✳️',
  description: "Wallet",
  localeDefault: 'en',
};
