import type { bloc } from "@polkadot-api/descriptors";
import type { PolkadotClient, TypedApi } from "polkadot-api";

export interface BlocApiClientContextInterface {
  blocClient: PolkadotClient;
  blocApi: TypedApi<typeof bloc>;
}
