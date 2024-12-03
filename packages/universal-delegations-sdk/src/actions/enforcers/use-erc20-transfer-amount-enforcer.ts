'use client';
import type { DelegationDb } from 'api-delegations';
import { useMemo } from 'react';
import { type Address, erc20Abi, formatUnits } from 'viem';
import { usePublicClient, useReadContract } from 'wagmi';
import { erc20TransferAmountEnforcerAbi } from '../../abis/erc20-transfer-amount-enforcer-abi.js';
import { getDelegationHash } from '../../delegation/get-delegation-hash.js';
import { decodeEnforcerERC20TransferAmount } from '../../enforcers/enforcer-erc20-transfer-amount.js';
import { findToken, getDefaultTokenList } from 'universal-data';

export function useErc20TransferAmountEnforcer({
  delegationManager,
  address,
  delegation,
}: {
  delegationManager: Address;
  address: Address;
  delegation: DelegationDb;
}) {
  const client = usePublicClient();
  const hash = getDelegationHash(delegation);
  const spentMap = useReadContract({
    abi: erc20TransferAmountEnforcerAbi,
    address: address,
    functionName: 'spentMap',
    args: [delegationManager, hash],
    query: {
      refetchInterval: 7000,
    },
  });

  const data = useMemo(() => {
    if (
      client &&
      delegation &&
      delegation?.caveats?.[0]?.terms &&
      typeof spentMap.data === 'bigint'
    ) {
      const decodedTerms = decodeEnforcerERC20TransferAmount(
        delegation.caveats[0].terms,
      );
      const tokenList = getDefaultTokenList({
        chainId: delegation.chainId,
      });
      const address = decodedTerms[0] as Address;
      const token = findToken({
        address,
        tokenList,
      });
      if (token) {
        return {
          to: delegation.delegate,
          token: decodedTerms[0] as Address,
          name: token.name,
          symbol: token.symbol,
          decimals: token.decimals,
          amount: decodedTerms[1],
          amountFormatted: formatUnits(
            (decodedTerms[1] as bigint) || BigInt(0),
            token.decimals,
          ),
          spent: spentMap.data,
          spentFormatted: formatUnits(
            (spentMap.data as bigint) || BigInt(0),
            token.decimals,
          ),
          spendLimitReached: spentMap.data >= BigInt(decodedTerms[1] as bigint),
        };
      }
      if (!token) {
        client
          ?.multicall({
            contracts: [
              {
                abi: erc20Abi,
                address: decodedTerms[0] as Address,
                functionName: 'name',
              },
              {
                abi: erc20Abi,
                address: decodedTerms[0] as Address,
                functionName: 'symbol',
              },
              {
                abi: erc20Abi,
                address: decodedTerms[0] as Address,
                functionName: 'decimals',
              },
            ],
          })
          .then((result) => {
            return {
              to: delegation.delegate,
              token: decodedTerms[0] as Address,
              name: result[0].result,
              symbol: result[1].result,
              decimals: result[2].result,
              amount: decodedTerms[1],
              amountFormatted: formatUnits(
                decodedTerms[1] as bigint,
                result[2].result as number,
              ),
              spent: spentMap.data,
              spentFormatted: formatUnits(
                (spentMap.data as bigint) || BigInt(0),
                result[2].result as number,
              ),
              spendLimitReached:
                (spentMap.data as bigint) >= BigInt(decodedTerms[1] as bigint),
            };
          })
          .catch(() => {
            return null;
          });
      }
    }
    return null;
  }, [client, delegation, spentMap.data]);

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
