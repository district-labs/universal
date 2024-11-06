import { type Address } from 'viem';
import { baseSepolia } from 'viem/chains';

export const delegationFrameworkDeployments: {
  [chainId: number]: {
    [key: string]: Address;
  };
} = {
  [baseSepolia.id as number]: {
    erc20Mintable: '0x4C8Be898BdE148aE6f9B0AF86e7D2b5a0558A7d0',
    delegationManager: '0x42f53d86aF500b0Cc98B3B1275a36fd438060a32',
    enforcerERC20TransferAmount: '0xCe80d9dB89A25f9884010d06fd7A96Af25EBC5e9',
  },
} as const;
