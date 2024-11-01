// biome-ignore lint/performance/noBarrelFile: entrypoint module
export {
  type UniversalWalletParameters,
  universalWallet as universalWallet,
} from "../universalWallet.js";

export {
  universalWalletRainbowkit
} from "../raibow-kit/universal-wallet-rainbow-kit.js";

export { version } from "../version.js";
