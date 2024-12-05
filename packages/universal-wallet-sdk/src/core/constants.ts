// TODO: Move to .env
export const WALLET_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://keys.univrsal.co/connect'
    : 'http://localhost:3000/connect';
