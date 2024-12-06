import { bloc } from "@polkadot-api/descriptors";
import { getWsProvider } from "@polkadot-api/ws-provider/web";
import { defineConfig } from "@reactive-dot/core";
import { InjectedWalletProvider } from "@reactive-dot/core/wallets.js";
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat";

import blocConfig from "@/config/bloc";

export default defineConfig({
  chains: {
    bloc: {
      descriptor: bloc,
      provider: withPolkadotSdkCompat(getWsProvider(blocConfig.wsAddress)),
    },
  },
  wallets: [new InjectedWalletProvider()],
});
