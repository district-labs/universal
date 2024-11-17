import { createConnector } from "wagmi";
import {
  type UniversalWalletParameters,
  universalWallet as universalConnector,
} from "../universalWallet.js";

import type { Wallet, WalletDetailsParams } from "@rainbow-me/rainbowkit";

type UniversalWallet = (params: UniversalWalletParameters) => Wallet;

export const universalWalletRainbowkit: UniversalWallet = ({
	appName,
	appLogoUrl,
}) => {
	return {
		id: "universalWallet",
		name: "Universal Wallet",
		shortName: "Universal",
		iconUrl: "https://wallet.districtlabs.com/images/icon-sm.png",
		iconAccent: "#fff",
		iconBackground: "#fff",
		createConnector: (walletDetails: WalletDetailsParams) => {
			const connector = universalConnector({
				appName,
				appLogoUrl,
			});

			return createConnector((config) => ({
				...connector(config),
				...walletDetails,
			}));
		},
	};
};
