import { Core } from '@walletconnect/core';
import { WalletKit, type WalletKitTypes } from '@reown/walletkit';
// import the builder util
import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils';
import { universalWallet } from 'universal-wallet-connector';
import { wagmiConfig } from '@/lib/wagmi/wagmi-config';
import { base, baseSepolia, mainnet } from 'viem/chains';
import { env } from '@/env';

const supportedChainIds = [mainnet.id, base.id, baseSepolia.id];

const core = new Core({
  projectId: env.NEXT_PUBLIC_WC_PROJECT_ID,
});

export const walletKitClient = await WalletKit.init({
  core, // <- pass the shared `core` instance
  metadata: {
    name: 'Demo app',
    description: 'Demo Client as Wallet/Peer',
    url: 'https://reown.com/walletkit',
    icons: [],
  },
});

const universalWalletConnector = universalWallet();
// @ts-expect-error
const connector = universalWalletConnector(wagmiConfig);

async function onSessionProposal({
  id,
  params,
}: WalletKitTypes.SessionProposal) {
  try {
    console.log('onSessionProposal');

    await connector.disconnect();

    const { chainId, accounts } = await connector.connect();

    // ------- namespaces builder util ------------ //
    const approvedNamespaces = buildApprovedNamespaces({
      proposal: params,
      supportedNamespaces: {
        eip155: {
          // TODO: refactor to get all supported chains
          chains: supportedChainIds.map((chainId) => `eip155:${chainId}`),
          methods: [
            'eth_sendTransaction',
            'personal_sign',
            'eth_signTypedData_v4',
            'wallet_sendCalls',
          ],
          events: ['accountsChanged', 'chainChanged'],
          accounts: accounts
            .map((account) =>
              supportedChainIds.map(
                (chainId) => `eip155:${chainId}:${account}`,
              ),
            )
            .flat(),
        },
      },
    });
    // ------- end namespaces builder util ------------ //

    const session = await walletKitClient.approveSession({
      id,
      namespaces: approvedNamespaces,
    });
  } catch (error) {
    // use the error.message to show toast/info-box letting the user know that the connection attempt was unsuccessful
    await walletKitClient.rejectSession({
      id: params.id,
      reason: getSdkError('USER_REJECTED'),
    });
  }
}

async function onSessionRequest(event: WalletKitTypes.SessionRequest) {
  await connector.connect();
  const provider = await connector.getProvider();

  console.log('onSessionRequest', event);

  const { topic, params: eventParams, id } = event;
  const { request } = eventParams;

  const { method, params } = request;

  const result = await provider.request({
    method,
    params,
  });

  await walletKitClient.respondSessionRequest({
    topic,
    response: { id, result, jsonrpc: '2.0' },
  });
}

walletKitClient.on('session_proposal', onSessionProposal);
walletKitClient.on('session_request', onSessionRequest);
