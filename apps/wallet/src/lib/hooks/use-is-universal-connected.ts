import { universalWalletConnectorId } from 'universal-wallet-connector';
import { useAccount } from 'wagmi';

export function useIsUniversalConnected() {
  const { connector } = useAccount();

  return connector?.id === universalWalletConnectorId;
}
