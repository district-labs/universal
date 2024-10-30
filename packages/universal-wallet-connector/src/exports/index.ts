// biome-ignore lint/performance/noBarrelFile: entrypoint module
export {
  type InjectedParameters,
  injected,
  type MockParameters,
  mock,
} from "@wagmi/core";

export {
  type UniversalWalletParameters,
  universalWallet as universalWallet,
} from "../universalWallet.js";

export { version } from "../version.js";
