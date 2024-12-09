'use client';

import { useMemo } from 'react';
import {
  findToken,
  getDefaultTokenList,
  erc20TransferAmountEnforcerAbi,
  universalDeployments,
} from 'universal-data';
import { erc20Abi, formatUnits } from 'viem';
import { usePublicClient, useReadContract } from 'wagmi';
import { getDelegationHash } from '../../delegation/get-delegation-hash.js';
import { decodeEnforcerERC20TransferAmount } from '../../enforcers/enforcer-erc20-transfer-amount.js';
import type { DelegationCaveat, DelegationWithMetadata } from 'universal-types';

function getErc20TransferAmountEnforcerFromDelegation(
  delegation: DelegationWithMetadata,
): DelegationCaveat {
  const erc20TransferAmountEnforcer = delegation.caveats.find(
    ({ enforcer }) =>
      enforcer.toLowerCase() ===
      universalDeployments.ERC20TransferAmountEnforcer.toLowerCase(),
  );
  if (!erc20TransferAmountEnforcer) {
    throw new Error('No ERC20TransferAmountEnforcer found');
  }

  return erc20TransferAmountEnforcer;
}

export function useErc20TransferAmountEnforcer({
  delegation,
}: {
  delegation: DelegationWithMetadata;
}) {
  const { enforcer, terms } =
    getErc20TransferAmountEnforcerFromDelegation(delegation);

  const client = usePublicClient();
  const hash = getDelegationHash(delegation);
  const spentMap = useReadContract({
    abi: erc20TransferAmountEnforcerAbi,
    address: enforcer,
    functionName: 'spentMap',
    args: [delegation.verifyingContract, hash],
    query: {
      refetchInterval: 7000,
    },
  });

  const data = useMemo(() => {
    if (client && typeof spentMap.data === 'bigint') {
      const [tokenAddress, amount] = decodeEnforcerERC20TransferAmount(terms);
      const tokenList = getDefaultTokenList({
        chainId: delegation.chainId,
      });

      const token = findToken({
        address: tokenAddress,
        tokenList,
      });
      if (token) {
        return {
          to: delegation.delegate,
          token: tokenAddress,
          name: token.name,
          symbol: token.symbol,
          decimals: token.decimals,
          amount,
          amountFormatted: formatUnits(amount || BigInt(0), token.decimals),
          spent: spentMap.data,
          spentFormatted: formatUnits(
            (spentMap.data as bigint) || BigInt(0),
            token.decimals,
          ),
          spendLimitReached: spentMap.data >= amount,
        };
      }
      if (!token) {
        client
          ?.multicall({
            contracts: [
              {
                abi: erc20Abi,
                address: tokenAddress,
                functionName: 'name',
              },
              {
                abi: erc20Abi,
                address: tokenAddress,
                functionName: 'symbol',
              },
              {
                abi: erc20Abi,
                address: tokenAddress,
                functionName: 'decimals',
              },
            ],
          })
          .then((result) => {
            return {
              to: delegation.delegate,
              token: tokenAddress,
              name: result[0].result,
              symbol: result[1].result,
              decimals: result[2].result,
              amount,
              amountFormatted: formatUnits(amount, result[2].result as number),
              spent: spentMap.data,
              spentFormatted: formatUnits(
                (spentMap.data as bigint) || BigInt(0),
                result[2].result as number,
              ),
              spendLimitReached: (spentMap.data as bigint) >= amount,
            };
          })
          .catch(() => {
            return null;
          });
      }
    }
    return null;
  }, [client, delegation, spentMap.data, terms]);

  const formatted = useMemo(() => {
    if (!spentMap) return null;
    return {
      raw: spentMap.data,
      formatted: formatUnits((spentMap.data as bigint) || BigInt(0), 18),
    };
  }, [spentMap]);

  return {
    data,
    spentMap,
    formatted,
  };
}
