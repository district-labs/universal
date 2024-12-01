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
  name: 'Universal',
  company: 'District',
  description: "Discover What's Possible",
  localeDefault: 'en',
};
