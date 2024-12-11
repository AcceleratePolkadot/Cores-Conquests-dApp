import _ from "lodash";

import type { ExpulsionProposal } from "./types";

export const isEqual = (a: ExpulsionProposal[], b: ExpulsionProposal[]) => {
  const $a = a.map((proposal) => ({
    ...proposal,
    reason: proposal.reason.asText(),
    roster: proposal.roster.asHex(),
  }));
  const $b = b.map((proposal) => ({
    ...proposal,
    reason: proposal.reason.asText(),
    roster: proposal.roster.asHex(),
  }));
  return _.isEqual($a, $b);
};
