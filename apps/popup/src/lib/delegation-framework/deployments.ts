import { anvil, baseSepolia } from 'viem/chains';

export const delegationDeployments = {
  [anvil.id]: {
    // Periphery
    multisigDelegatoFactory: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',

    // Delegation Core
    delegationManager: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',

    // Enforcers
    onchainStoreMintsEnforcer: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
  },
  [baseSepolia.id]: {
    multisigDelegatoFactory: '0x6d8d7069929e17b8522DAACa1D9df783aA6c893F',
    delegationManager: '0x42f53d86af500b0cc98b3b1275a36fd438060a32',
    ERC20PaymentEnforcer: '0x5B987A4202adB1acF133cFF69750C1959938dFda',
    ERC20PaymentAffiliateEnforcer: '0xfdD7E622399A9596eD9D357336926f161C04bAb1',
    ERC20TimedStepDiscountEnforcer:
      '0xf9e79e6D3E4f82F1Bb8943e19Deecf484bBdFAe0',
    ERC20TimedStepRewardEnforcer: '0x7479b1169Ee5B41B7F74902B71F852a4c741da6A',
  },
} as const;
