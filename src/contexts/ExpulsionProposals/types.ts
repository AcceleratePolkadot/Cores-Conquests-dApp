import type { AccountId } from "@/contexts/Accounts/types";
import type { BlockNumber, RosterId } from "@/contexts/Rosters/types";
import type { BlocEvents, BlocQueries } from "@polkadot-api/descriptors";
import type { Enum } from "polkadot-api";
import type { Subscription } from "rxjs";

export type ExpulsionProposal = BlocQueries["Roster"]["ExpulsionProposals"]["Value"];

export type ExpulsionProposalStatus = Enum<{
  Pending: undefined;
  Approved: undefined;
  Rejected: undefined;
}>;

export type ExpulsionProposalVoteValue = Enum<{ Aye: undefined; Nay: undefined }>;

export type ExpulsionProposalVote = {
  voter: AccountId;
  voted_on: BlockNumber;
  vote: ExpulsionProposalVoteValue;
};

export type EventSubscriptions = Partial<Record<keyof BlocEvents["Roster"], Subscription>>;

export interface ExpulsionProposalsContextType {
  expulsionProposals: ExpulsionProposal[];
  forRoster: (rosterId: RosterId) => ExpulsionProposal[];
  againstSubject: (subject: AccountId) => ExpulsionProposal[];
  byMotioner: (motioner: AccountId) => ExpulsionProposal[];
  secondedBy: (seconder: AccountId) => ExpulsionProposal[];
  expulsionProposalEventSubscriptions: EventSubscriptions;
  refreshExpulsionProposals: () => Promise<void>;
}
