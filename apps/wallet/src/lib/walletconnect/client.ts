import { env } from '@/env';
import { WalletKit } from '@reown/walletkit';
import { Core } from '@walletconnect/core';

export const walletKitClient = await createWalletKitClient();

export async function createWalletKitClient() {
  const core = new Core({
    projectId: env.NEXT_PUBLIC_WC_PROJECT_ID,
  });
  const walletKitClient = await WalletKit.init({
    core,
    metadata: {
      name: 'Universal Wallet',
      description: 'Universal Wallet',
      url: 'https://wallet.districtlabs.com/',
      icons: [],
    },
    signConfig: {
      disableRequestQueue: true,
    },
  });

  try {
    const clientId =
      await walletKitClient.engine.signClient.core.crypto.getClientId();
    if (localStorage) {
      localStorage.setItem('WALLETCONNECT_CLIENT_ID', clientId);
    }
  } catch (error) {
    console.error(
      'Failed to set WalletConnect clientId in localStorage: ',
      error,
    );
  }

  return walletKitClient;
}
