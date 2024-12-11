import type { ExpulsionProposal } from "@/contexts/ExpulsionProposals/types";

export interface ExpulsionProposalDetailsConfigValuesProps {
  proposal: ExpulsionProposal;
}

export type configItem =
  | {
      id?: React.Key;
      label: Exclude<React.Key, bigint>;
      value: React.ReactNode;
      subLabel?: React.ReactNode;
    }
  | {
      // if label can not be used as a key then id is no longer optional
      id: React.Key;
      label: Exclude<React.ReactNode, React.Key>;
      value: React.ReactNode;
      subLabel?: React.ReactNode;
    };

export interface ConfigItemCardsProps {
  configs: configItem[];
}
