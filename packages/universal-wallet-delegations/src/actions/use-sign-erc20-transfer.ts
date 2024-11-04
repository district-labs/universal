import { encodeAbiParameters, parseUnits, type Address } from 'viem';
import { useSignTypedData } from 'wagmi';
import { eip712DelegationTypes } from '../delegation/eip712-delegation-type.js';
import { ROOT_AUTHORITY, SALT } from '../constants.js';
import { delegationFrameworkDeployments } from '../deployments.js';

export function useSignErc20TransferDelegation() {
  const {
    data: delegationSignature,
    signTypedData,
    ...rest
  } = useSignTypedData();

  function signDelegation({
        chainId,
        delegator,
        delegate,
        salt = SALT,
        erc20,
        decimals = 18,
        amount = '0',
    }: {
        chainId: number;
        delegator: Address;
        delegate: Address;
        salt?: bigint;
        erc20: Address;
        decimals: number;
        amount: string;
    }) {
        if(!delegationFrameworkDeployments[chainId]) return;
        signTypedData({
        types: eip712DelegationTypes,
        primaryType: 'Delegation',
        domain: {
            name: 'DelegationManager',
            version: '1',
            chainId: chainId,
            verifyingContract: delegationFrameworkDeployments[chainId].delegationManager,
        },
        message: {
            delegate: delegate,
            delegator: delegator,
            authority: ROOT_AUTHORITY,
            salt: salt,
            caveats: [
            {
                enforcer: delegationFrameworkDeployments[chainId].enforcerERC20TransferAmount as Address,
                terms: encodeAbiParameters(
                    [
                        { name: 'token', type: 'address' },
                        { name: 'maxAmount', type: 'uint255' },
                    ],
                    [
                        erc20, 
                        parseUnits(amount, decimals)
                    ]
                ),
            }]
        },
    });
  }

  return {
    signDelegation,
    delegationSignature,
    ...rest,
  };
}
