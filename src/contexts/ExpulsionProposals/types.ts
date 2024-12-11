import type { Address } from "@/contexts/ActiveAccount/types";
import type { RosterId } from "@/contexts/Rosters/types";
import type { BlocQueries } from "@polkadot-api/descriptors";

export type ExpulsionProposal = BlocQueries["Roster"]["ExpulsionProposals"]["Value"];

export interface ExpulsionProposalsContextType {
  expulsionProposals: ExpulsionProposal[];
  forRoster: (rosterId: RosterId) => ExpulsionProposal[];
  againstSubject: (subject: Address) => ExpulsionProposal[];
  byMotioner: (motioner: Address) => ExpulsionProposal[];
  secondedBy: (seconded: Address) => ExpulsionProposal[];
  refreshExpulsionProposals: () => void;
}
