// TODO: Move to .env
export const WALLET_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://keys.districtlabs.com/connect'
    : 'http://localhost:3000/connect';
