import { useConfirmationDialog } from '@/components/core/confirmation-dialog-provider';
import type { WalletKitTypes } from '@reown/walletkit';
import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils';
import { useCallback, useEffect } from 'react';
import { universalWallet } from 'universal-wallet-connector';
import { base, baseSepolia, mainnet, sepolia } from 'viem/chains';
import { useWalletKitClient } from './use-wallet-kit-client';
import { useQueryClient } from '@tanstack/react-query';
import { type ConnectorEventMap, createConfig, http } from 'wagmi';
import { createEmitter } from '@/lib/wagmi/emitter';

const createUniversalWalletConnector = universalWallet({});

const config = createConfig({
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});

const emitter = createEmitter<ConnectorEventMap>(crypto.randomUUID());
const universalWalletConnector = createUniversalWalletConnector({
  ...config,
  emitter,
});
const supportedChainIds = [mainnet.id, sepolia.id, base.id, baseSepolia.id];

export function useWcEventsManager(initialized: boolean) {
  const { openDialog } = useConfirmationDialog();
  const { data: walletKitClient } = useWalletKitClient();
  const queryClient = useQueryClient();
  const onSessionProposal = useCallback(
    async ({ id, params }: WalletKitTypes.SessionProposal) => {
      try {
        if (!walletKitClient) {
          throw new Error('WalletKit client not initialized');
        }

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

        // Invalidate active connections query to update the UI
        await queryClient.invalidateQueries({
          queryKey: ['wc-active-connections'],
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
    [walletKitClient, queryClient],
  );

  const onSessionDelete = useCallback(async () => {
    // Invalidate active connections query to update the UI
    await queryClient.invalidateQueries({
      queryKey: ['wc-active-connections'],
    });
  }, [queryClient]);

  const onSessionRequest = useCallback(
    async (event: WalletKitTypes.SessionRequest) => {
      try {
        if (!walletKitClient) {
          throw new Error('WalletKit client not initialized');
        }
        await universalWalletConnector.connect();
        const provider = await universalWalletConnector.getProvider();
        const { topic, params: eventParams, id } = event;
        const { request, chainId } = eventParams;
        const { method, params } = request;

        const dialogConfirmed = await openDialog();
        console.log('dialogConfirmed', Number(chainId.replace('eip155:', '')));
        if (dialogConfirmed) {
          if (universalWalletConnector?.switchChain) {
            // Ensure the universal wallet is connected with the correct chain
            await universalWalletConnector?.switchChain({
              chainId: Number(chainId.replace('eip155:', '')),
            });
          }
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
            response: {
              id,
              error: getSdkError('USER_REJECTED'),
              jsonrpc: '2.0',
            },
          });
        }
      } catch (error) {
        console.error('Error handling session request', error);
      }
    },
    [walletKitClient, openDialog],
  );

  // Set up WalletConnect event listeners
  useEffect(() => {
    if (!initialized || !walletKitClient) {
      return;
    }

    walletKitClient.on('session_proposal', onSessionProposal);
    walletKitClient.on('session_delete', onSessionDelete);
    walletKitClient.on('session_request', onSessionRequest);

    return () => {
      walletKitClient.off('session_proposal', onSessionProposal);
      walletKitClient.off('session_delete', onSessionDelete);
      walletKitClient.off('session_request', onSessionRequest);
    };
  }, [
    walletKitClient,
    initialized,
    onSessionProposal,
    onSessionDelete,
    onSessionRequest,
  ]);
}
