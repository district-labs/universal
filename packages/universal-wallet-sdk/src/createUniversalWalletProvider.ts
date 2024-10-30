import { UniversalWalletProvider } from "./UniversalWalletProvider";
import {
  AppMetadata,
  ConstructorOptions
} from ":core/provider/interface";

export type CreateProviderOptions = {
  metadata: AppMetadata;

};

export function createUniversalWalletProvider(options: CreateProviderOptions) {
  const params: ConstructorOptions = {
    metadata: options.metadata,
  };
  return (
    new UniversalWalletProvider(params)
  );
}
