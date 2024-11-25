import type { Address } from "@/contexts/ActiveAccount/types";
import type { RosterId } from "@/contexts/Rosters/types";
import type { BlocQueries } from "@polkadot-api/descriptors";

export type Nomination = BlocQueries["Roster"]["Nominations"]["Value"];

export interface NominationsContextType {
  nominations: Nomination[];
  toRoster: (rosterId: RosterId) => Nomination[];
  forNominee: (nominee: Address) => Nomination[];
  byNominator: (nominator: Address) => Nomination[];
  approvedForNominee: (nominee: Address) => Nomination[];
  pendingForNominee: (nominee: Address) => Nomination[];
  refreshNominations: () => void;
}
