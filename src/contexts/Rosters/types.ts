import type { BlocQueries } from "@polkadot-api/descriptors";
import type { WalletAccount } from "@reactive-dot/core/wallets.js";

export type Roster = BlocQueries["Roster"]["Rosters"]["Value"];
export type RosterId = Roster["id"];

export interface RostersContextType {
  rosters: Roster[];
  activeRoster: Roster | undefined;
  setActiveRoster: (roster: Roster) => void;
  getRoster: (rosterId: RosterId) => Roster | undefined;
  foundedBy: (account: WalletAccount) => Roster[];
  memberOf: (account: WalletAccount) => Roster[];
  refreshRosters: () => void;
}
