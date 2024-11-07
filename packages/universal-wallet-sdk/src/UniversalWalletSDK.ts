import { LogoType, walletLogo } from './assets/wallet-logo';
import { AppMetadata, ProviderInterface } from './core/provider/interface';
import { UniversalWalletProvider } from './UniversalWalletProvider';
import { LIB_VERSION } from './version';
import { ScopedLocalStorage } from ':core/storage/ScopedLocalStorage';
import { getFavicon } from ':core/type/util';
import { checkCrossOriginOpenerPolicy } from ':util/crossOriginOpenerPolicy';

// for backwards compatibility
type UniversalWalletSDKOptions = Partial<AppMetadata>;

/**
 * UniversalWalletSDK
 *
 * @deprecated UniversalWalletSDK is deprecated and will likely be removed in a future major version release.
 * It's recommended to use `createUniversalWalletSDK` instead.
 */
export class UniversalWalletSDK {
  private metadata: AppMetadata;

  constructor(metadata: Readonly<UniversalWalletSDKOptions>) {
    this.metadata = {
      appName: metadata.appName || 'Dapp',
      appLogoUrl: metadata.appLogoUrl || getFavicon(),
      appChainIds: metadata.appChainIds || [],
    };
    this.storeLatestVersion();
    this.checkCrossOriginOpenerPolicy();
  }

  public makeWeb3Provider(): ProviderInterface {
    const params = { metadata: this.metadata };
    return new UniversalWalletProvider(params);
  }

  /**
   * Universal Wallet logo for developers to use on their frontend
   * @param type Type of wallet logo: "standard" | "circle" | "text" | "textWithLogo" | "textLight" | "textWithLogoLight"
   * @param width Width of the logo (Optional)
   * @returns SVG Data URI
   */
  public getUniversalWalletLogo(type: LogoType, width = 240): string {
    return walletLogo(type, width);
  }

  private storeLatestVersion() {
    const versionStorage = new ScopedLocalStorage('UNWSDK');
    versionStorage.setItem('VERSION', LIB_VERSION);
  }

  private checkCrossOriginOpenerPolicy() {
    void checkCrossOriginOpenerPolicy();
  }
}
