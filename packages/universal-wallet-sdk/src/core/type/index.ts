interface Tag<T extends string, RealType> {
  __tag__: T;
  __realType__: RealType;
}

export type OpaqueType<T extends string, U> = U & Tag<T, U>;

export function OpaqueType<T extends Tag<string, unknown>>() {
  return (value: T extends Tag<string, infer U> ? U : never): T => value as T;
}

export type HexString = OpaqueType<'HexString', string>;
export const HexString = OpaqueType<HexString>();

export type AddressString = OpaqueType<'AddressString', string>;
export const AddressString = OpaqueType<AddressString>();

export type BigIntString = OpaqueType<'BigIntString', string>;
export const BigIntString = OpaqueType<BigIntString>();

export type IntNumber = OpaqueType<'IntNumber', number>;
export function IntNumber(num: number): IntNumber {
  return Math.floor(num) as IntNumber;
}

export type RegExpString = OpaqueType<'RegExpString', string>;
export const RegExpString = OpaqueType<RegExpString>();

export type Callback<T> = (err: Error | null, result: T | null) => void;

export type Web3Method = _Web3Request['method'];
export type Web3Request<M extends Web3Method = Web3Method> = Extract<_Web3Request, { method: M }>;

type _Web3Request =
  | {
      method: 'requestEthereumAccounts';
      params: {
        appName: string;
        appLogoUrl: string | null;
      };
    }
  | {
      method: 'childRequestEthereumAccounts';
    }
  | {
      method: 'connectAndSignIn';
      params: {
        appName: string;
        appLogoUrl: string | null;
        domain: string;
        aud: string;
        version: string;
        type: string;
        nonce: string;
        iat: string;
        chainId: string;
        statement?: string;
        resources?: string[];
      };
    }
  | {
      method: 'addEthereumChain';
      params: {
        chainId: string;
        blockExplorerUrls?: string[];
        chainName?: string;
        iconUrls?: string[];
        rpcUrls: string[];
        nativeCurrency?: {
          name: string;
          symbol: string;
          decimals: number;
        };
      };
    }
  | {
      method: 'switchEthereumChain';
      params: {
        chainId: string;
        address?: string;
      };
    }
  | {
      method: 'signEthereumMessage';
      params: {
        message: HexString;
        address: AddressString;
        addPrefix: boolean;
        typedDataJson: string | null;
      };
    }
  | {
      method: 'signEthereumTransaction';
      params: {
        fromAddress: AddressString;
        toAddress: AddressString | null;
        weiValue: BigIntString;
        data: HexString;
        nonce: IntNumber | null;
        gasPriceInWei: BigIntString | null;
        maxFeePerGas: BigIntString | null; // in wei
        maxPriorityFeePerGas: BigIntString | null; // in wei
        gasLimit: BigIntString | null;
        chainId: number;
        shouldSubmit: boolean;
      };
    }
  | {
      method: 'submitEthereumTransaction';
      params: {
        signedTransaction: HexString;
        chainId: number;
      };
    }
  | {
      method: 'ethereumAddressFromSignedMessage';
      params: {
        message: HexString;
        signature: HexString;
        addPrefix: boolean;
      };
    }
  | {
      method: 'watchAsset';
      params: {
        type: string;
        options: {
          address: string;
          symbol?: string;
          decimals?: number;
          image?: string;
        };
        chainId?: string;
      };
    };

export type Web3Response<M extends Web3Method = Web3Method> =
  | Extract<_Web3Response, { method: M }>
  | ErrorResponse;

type ErrorResponse = {
  method: unknown;
  errorCode?: number;
  errorMessage: string;
};

export function isErrorResponse(response: unknown): response is ErrorResponse {
  return (response as ErrorResponse).errorMessage !== undefined;
}

type _Web3Response =
  | {
      method: 'connectAndSignIn';
      result: {
        accounts: AddressString[];
        message: HexString;
        signature: HexString;
      };
    }
  | {
      method: 'addEthereumChain';
      result: {
        isApproved: boolean;
        rpcUrl: string;
      };
    }
  | {
      method: 'switchEthereumChain';
      result: {
        isApproved: boolean;
        rpcUrl: string;
      };
    }
  | {
      method: 'requestEthereumAccounts';
      result: AddressString[];
    }
  | {
      method: 'watchAsset';
      result: boolean;
    }
  | {
      method: 'signEthereumMessage';
      result: HexString;
    }
  | {
      method: 'signEthereumTransaction';
      result: HexString;
    }
  | {
      method: 'submitEthereumTransaction';
      result: HexString;
    }
  | {
      method: 'ethereumAddressFromSignedMessage';
      result: AddressString;
    };
