import { useConfirmationDialog } from '@/components/core/confirmation-dialog-provider';
import { wagmiConfig } from '@/lib/wagmi/wagmi-config';
import type { WalletKitTypes } from '@reown/walletkit';
import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils';
import { useCallback, useEffect } from 'react';
import { universalWallet } from 'universal-wallet-connector';
import { base, baseSepolia, mainnet, sepolia } from 'viem/chains';
import { walletKitClient } from '../client';

const createUniversalWalletConnector = universalWallet();
// @ts-expect-error
const universalWalletConnector = createUniversalWalletConnector(wagmiConfig);
const supportedChainIds = [mainnet.id, sepolia.id, base.id, baseSepolia.id];

export function useWcEventsManager(initialized: boolean) {
  const { openDialog } = useConfirmationDialog();
  const onSessionProposal = useCallback(
    async ({ id, params }: WalletKitTypes.SessionProposal) => {
      try {
        const { accounts } = await universalWalletConnector.connect();
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
              accounts: accounts.flatMap((account) =>
                supportedChainIds.map(
                  (chainId) => `eip155:${chainId}:${account}`,
                ),
              ),
            },
          },
        });
        // ------- end namespaces builder util ------------ //

        await walletKitClient.approveSession({
          id,
          namespaces: approvedNamespaces,
        });
      } catch (_error) {
        if (!walletKitClient) {
          return;
        }
        // use the error.message to show toast/info-box letting the user know that the connection attempt was unsuccessful
        await walletKitClient.rejectSession({
          id: params.id,
          reason: getSdkError('USER_REJECTED'),
        });
      }
    },
    [],
  );

  const onSessionRequest = useCallback(
    async (event: WalletKitTypes.SessionRequest) => {
      await universalWalletConnector.connect();
      const provider = await universalWalletConnector.getProvider();
      const { topic, params: eventParams, id } = event;
      const { request } = eventParams;
      const { method, params } = request;

      const dialogConfirmed = await openDialog();

      if (dialogConfirmed) {
        const result = await provider.request({
          method,
          params,
        });

        await walletKitClient.respondSessionRequest({
          topic,
          response: { id, result, jsonrpc: '2.0' },
        });
      } else {
        await walletKitClient.respondSessionRequest({
          topic,
          response: { id, error: getSdkError('USER_REJECTED'), jsonrpc: '2.0' },
        });
      }
    },
    [openDialog],
  );

  // Set up WalletConnect event listeners
  useEffect(() => {
    if (!initialized) {
      return;
    }

    walletKitClient.on('session_proposal', onSessionProposal);
    walletKitClient.on('session_request', onSessionRequest);
    // return () => {
    //   walletKitClient.off('session_proposal', onSessionProposal);
    //   walletKitClient.off('session_request', onSessionRequest);
    // };
  }, [initialized, onSessionProposal, onSessionRequest]);
}
