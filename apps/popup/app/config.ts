// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Site
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
interface SiteConfig {
  name: string;
  company: string;
  description: string;
  localeDefault: string;
}

export const siteConfig: SiteConfig = {
  name: 'Universal Wallet',
  company: 'District',
  description: "Discover What's Possible",
  localeDefault: 'en',
};
