import { createConfig } from '@ponder/core';
import { http } from 'viem';

import {
  delegationManagerAbi,
  erc20TransferAmountAbi,
  universalDeployments,
} from 'universal-data';
import { baseSepolia } from 'viem/chains';

const BASE_SEPOLIA_START_BLOCK = 17695840;
console.log(
  'process.env.PONDER_RPC_URL_BASE_SEPOLIA',
  process.env.PONDER_RPC_URL_BASE_SEPOLIA,
);
export default createConfig({
  networks: {
    baseSepolia: {
      chainId: baseSepolia.id,
      transport: http(process.env.PONDER_RPC_URL_BASE_SEPOLIA),
    },
  },
  contracts: {
    DelegationManager: {
      network: 'baseSepolia',
      abi: delegationManagerAbi,
      address: universalDeployments[baseSepolia.id].DelegationManager,
      startBlock: BASE_SEPOLIA_START_BLOCK,
    },
    ERC20TransferAmountEnforcer: {
      network: 'baseSepolia',
      abi: erc20TransferAmountAbi,
      address: universalDeployments[baseSepolia.id].ERC20TransferAmountEnforcer,
      startBlock: BASE_SEPOLIA_START_BLOCK,
    },
  },
});
