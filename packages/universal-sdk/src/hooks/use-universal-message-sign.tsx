import { useChainId, useSignTypedData } from 'wagmi';
import { eip712UniversalMessageType } from '../eip712-universal-message-type.js';

type UniversalMessageSignParams = {
  content: string;
};

export function useUniversalMessageSign() {
  const chainId = useChainId();
  const {
    signTypedData: _signTypedData,
    signTypedDataAsync: _signTypedDataAsync,
    ...rest
  } = useSignTypedData();

  function signTypedData({ content }: UniversalMessageSignParams) {
    _signTypedData({
      types: eip712UniversalMessageType,
      primaryType: 'UniversalMessage',
      domain: {
        name: 'Universal Resolver',
        version: '1',
        chainId: chainId,
      },
      message: {
        content: content,
      },
    });
  }

  async function signTypedDataAsync({ content }: UniversalMessageSignParams) {
    return await _signTypedDataAsync({
      types: eip712UniversalMessageType,
      primaryType: 'UniversalMessage',
      domain: {
        name: 'Universal Resolver',
        version: '1',
        chainId: chainId,
      },
      message: {
        content: content,
        // content: "I want to discover what's possible in the Universal Network.",
      },
    });
  }

  return {
    signTypedData,
    signTypedDataAsync,
    ...rest,
  };
}
