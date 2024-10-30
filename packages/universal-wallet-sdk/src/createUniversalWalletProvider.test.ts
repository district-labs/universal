import { UniversalWalletProvider } from "./UniversalWalletProvider";
import { createUniversalWalletProvider } from "./createUniversalWalletProvider";
import { ConstructorOptions } from "./core/provider/interface";

describe("createUniversalWalletProvider", () => {
  it("should return a provider", () => {
    const options: ConstructorOptions = {
      metadata: {
        appName: "Dapp",
        appLogoUrl: "https://example.com/favicon.ico",
        appChainIds: [],
      },
    };
    const result = createUniversalWalletProvider(options);
    expect(result).toBeInstanceOf(UniversalWalletProvider);
  });
});
