# Universal Wallet SDK

The Universal Wallet SDK is a Wallet provider SDK to communicate with `universal-wallet-app` popup.

### Installation


```shell
# npm
npm install universal-wallet-sdk

# pnpm
pnpm add universal-wallet-sdk
```

### Basic Usage


```js
const sdk = new UniversalWalletSDK({
   appName: 'Universal Playground',
});
```

```js
const provider = sdk.makeWeb3Provider();
```


```js
const addresses = provider.request({
   method: 'eth_requestAccounts',
});
```

## Acknowledgements
The Universal Wallet SDK is a fork of the [Coinbase Wallet SDK](https://github.com/coinbase/coinbase-wallet-sdk) with a few minor modifications.

We would like to thank the Coinbase team for their work and contributions to Open Source.

## License

This project is licensed under Apache 2.0 license. See the [LICENSE](./LICENSE) file for more details.

