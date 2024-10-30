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
  name: 'Universal Wallet Demo',
  title: 'Universal Wallet Demo',
  emoji: '⚡',
  description: "Discover What's Possible",
  localeDefault: 'en',
};
