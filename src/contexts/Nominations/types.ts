import type { AccountId } from "@/contexts/Accounts/types";
import type { BlockNumber, RosterId } from "@/contexts/Rosters/types";
import type { Enum } from "polkadot-api";
import type { Subscription } from "rxjs";

export type Nomination = {
  roster: RosterId;
  nominee: AccountId;
  nominator: AccountId;
  nominated_on: BlockNumber;
  votes: NominationVote[];
  status: NominationStatus;
};

export type NominationStatus = Enum<{
  Pending: undefined;
  Approved: undefined;
  Rejected: undefined;
}>;

export type NominationVoteValue = Enum<{ Aye: undefined; Nay: undefined }>;

export type NominationVote = {
  voter: AccountId;
  voted_on: BlockNumber;
  vote: NominationVoteValue;
};

export type EventSubscriptions = {
  NewNomination: Subscription;
  NominationClosed: Subscription;
  Voted: Subscription;
  VoteRecanted: Subscription;
};

export interface NominationsContextType {
  nominations: Nomination[];
  toRoster: (rosterId: RosterId) => Nomination[];
  forNominee: (nominee: AccountId) => Nomination[];
  byNominator: (nominator: AccountId) => Nomination[];
  approvedForNominee: (nominee: AccountId) => Nomination[];
  pendingForNominee: (nominee: AccountId) => Nomination[];
  nominationEventSubscriptions: EventSubscriptions;
  refreshNominations: () => Promise<void>;
  nominationVotingPeriod: number | undefined;
}
