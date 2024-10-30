import { UniversalWalletSDK } from './UniversalWalletSDK';
export default UniversalWalletSDK;

export type { AppMetadata, ProviderInterface } from './core/provider/interface';
export type { UniversalWalletProvider } from './UniversalWalletProvider';
export { UniversalWalletSDK } from './UniversalWalletSDK';
export type { CryptoKeyType } from './util/cipher';
export {
  decryptContent,
  deriveSharedSecret,
  encryptContent,
  exportKeyToHexString,
  generateKeyPair,
  importKeyFromHexString,
} from './util/cipher';
