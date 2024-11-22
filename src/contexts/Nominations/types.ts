import type { RosterId } from "@/contexts/Rosters/types";
import type { BlocQueries } from "@polkadot-api/descriptors";
import type { WalletAccount } from "@reactive-dot/core/wallets.js";

export type Nomination = BlocQueries["Roster"]["Nominations"]["Value"];

export interface NominationsContextType {
  nominations: Nomination[];
  toRoster: (rosterId: RosterId) => Nomination[];
  forNominee: (nominee: WalletAccount) => Nomination[];
  byNominator: (nominator: WalletAccount) => Nomination[];
  approvedForNominee: (nominee: WalletAccount) => Nomination[];
  pendingForNominee: (nominee: WalletAccount) => Nomination[];
  refreshNominations: () => void;
}
