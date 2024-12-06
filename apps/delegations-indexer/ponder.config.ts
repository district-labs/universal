import { createConfig } from '@ponder/core';
import { http } from 'viem';

import {
  delegationManagerAbi,
  erc20TransferAmountEnforcerAbi,
  universalDeployments,
} from 'universal-data';
import { base, baseSepolia } from 'viem/chains';

const BASE_SEPOLIA_START_BLOCK = 17695840;
const BASE_START_BLOCK = 23197800;

export default createConfig({
  networks: {
    base: {
      chainId: base.id,
      transport: http(process.env.PONDER_RPC_URL_BASE),
    },
    baseSepolia: {
      chainId: baseSepolia.id,
      transport: http(process.env.PONDER_RPC_URL_BASE_SEPOLIA),
    },
  },
  contracts: {
    DelegationManager: {
      abi: delegationManagerAbi,
      network: {
        base: {
          address: universalDeployments.DelegationManager,
          startBlock: BASE_START_BLOCK,
        },
        baseSepolia: {
          address: universalDeployments.DelegationManager,
          startBlock: BASE_SEPOLIA_START_BLOCK,
        },
      },
    },
    ERC20TransferAmountEnforcer: {
      abi: erc20TransferAmountEnforcerAbi,
      network: {
        base: {
          address: universalDeployments.ERC20TransferAmountEnforcer,
          startBlock: BASE_START_BLOCK,
        },
        baseSepolia: {
          address: universalDeployments.ERC20TransferAmountEnforcer,
          startBlock: BASE_SEPOLIA_START_BLOCK,
        },
      },
    },
  },
});
