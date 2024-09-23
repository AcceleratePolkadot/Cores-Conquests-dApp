import type { BlocConstants } from "@polkadot-api/descriptors";

import type { FixedSizeBinary } from "polkadot-api";

export type PalletId = FixedSizeBinary<8>;
export type RosterConstants = Partial<
  Record<keyof BlocConstants["Roster"], PalletId | bigint | number>
>;

export interface RosterConstantsContextType {
  rosterConstants: RosterConstants;
}
