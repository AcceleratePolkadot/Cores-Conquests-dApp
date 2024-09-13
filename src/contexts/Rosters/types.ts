import type { Binary, Enum, FixedSizeArray, FixedSizeBinary, SS58String } from "polkadot-api";
import type { Subscription } from "rxjs";

export type RosterId = FixedSizeBinary<16>;
export type BlockNumber = number;
export type AccountId = SS58String;
export type MembersList = AccountId[];
export type NominationsList = AccountId[];
export type ExpulsionProposalsList = FixedSizeArray<2, SS58String>[];
export type RosterStatus = Enum<{ Active: undefined; Inactive: undefined }>;

export type Roster = {
  id: RosterId;
  founder: AccountId;
  title: Binary;
  members: MembersList;
  nominations: NominationsList;
  expulsion_proposals: ExpulsionProposalsList;
  founded_on: BlockNumber;
  status: RosterStatus;
};

export type EventSubscriptions = {
  NewRoster: Subscription;
  RosterRemoved: Subscription;
  RosterStatusChanged: Subscription;
};

export interface RostersContextType {
  rosters: Roster[];
  activeRoster: Roster | undefined;
  setActiveRoster: (rosterId: Roster) => void;
  foundedBy: (account: AccountId) => Roster[];
  memberOf: (account: AccountId) => Roster[];
  rosterEventSubscriptions: EventSubscriptions;
  refreshRosters: () => Promise<void>;
}
