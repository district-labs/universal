import { useLocalStorage } from 'usehooks-ts';
import type { Address, Hex } from 'viem';

export type AccountState =
  | {
      publicKey: Hex;
      credentialId: string;
      smartContractAddress: Address;
    }
  | undefined;

export type UseAccountStateReturnType = ReturnType<typeof useAccountState>;

export function useAccountState() {
  const [accountState, setAccountState, removeAccountState] =
    useLocalStorage<AccountState>('accountState', undefined);

  return {
    accountState,
    setAccountState,
    removeAccountState,
  };
}
