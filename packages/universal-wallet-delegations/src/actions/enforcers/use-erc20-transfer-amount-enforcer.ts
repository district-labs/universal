'use client';
import { erc20Abi, formatUnits, type Address } from "viem"
import { useReadContract } from "wagmi"
import { usePublicClient } from 'wagmi'
import { getDelegationHash } from "../../delegation/get-delegation-hash.js";
import { useMemo } from "react";
import { decodeEnforcerERC20TransferAmount } from "../../enforcers/enforcer-erc20-transfer-amount.js";
import { findToken } from "universal-wallet-data";
import type { DelegationDb } from "delegations-api";


export function useErc20TransferAmountEnforcer({
    delegationManager,
    address,
    delegation
}:{
    delegationManager: Address,
    address: Address,
    delegation: DelegationDb,
}) {
    const client = usePublicClient()
    const hash = getDelegationHash(delegation)
    const spentMap = useReadContract({ 
        abi: [
            {
                "type": "function",
                "name": "spentMap",
                "inputs": [
                  {
                    "name": "delegationManager",
                    "type": "address",
                    "internalType": "address"
                  },
                  {
                    "name": "delegationHash",
                    "type": "bytes32",
                    "internalType": "bytes32"
                  }
                ],
                "outputs": [
                  {
                    "name": "amount",
                    "type": "uint256",
                    "internalType": "uint256"
                  }
                ]
              }
        ],
        address: address,
        functionName: "spentMap",
        args: [delegationManager, hash],
        query: {
            refetchInterval: 7000,
          },
    })

    const data = useMemo(() => {
      if (client && delegation && delegation?.caveats?.[0]?.terms && typeof spentMap.data === 'bigint') {
        const decodedTerms = decodeEnforcerERC20TransferAmount(
          delegation.caveats[0].terms,
        );

        const token = findToken(delegation.chainId, decodedTerms[0] as Address);
        if(token) {
          return {
            to: delegation.delegate,
            token: decodedTerms[0] as Address,
            name: token.name,
            symbol: token.symbol,
            decimals: token.decimals,
            amount: decodedTerms[1],
            amountFormatted: formatUnits(decodedTerms[1] as bigint || BigInt(0), token.decimals),
            spent: spentMap.data,
            spentFormatted: formatUnits(spentMap.data as bigint || BigInt(0), token.decimals),
            spendLimitReached: spentMap.data >= BigInt(decodedTerms[1] as bigint),
          };
        }
        if (!token) {
          client?.multicall({
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
              }
            ]
          }).then((result) => {
            return {
              to: delegation.delegate,
              token: decodedTerms[0] as Address,
              name: result[0].result,
              symbol: result[1].result,
              decimals: result[2].result,
              amount: decodedTerms[1],
              amountFormatted: formatUnits(decodedTerms[1] as bigint, result[2].result as number),
              spent: spentMap.data,
              spentFormatted: formatUnits(spentMap.data as bigint || BigInt(0), result[2].result as number),
              spendLimitReached: spentMap.data as bigint >= BigInt(decodedTerms[1] as bigint),
            };
          }).catch(() => {
            return null;
          })

        }
      }
      return null;
    }, [client?.account, delegation, spentMap.data]);

    const formatted = useMemo(() => {
      if(!spentMap) return null
        return {
            raw: spentMap.data,
            formatted: formatUnits(spentMap.data as bigint || BigInt(0), 18),
        }
    }, [spentMap])

    return {
        data,
        spentMap,
        formatted
    }
}
