import type { ExpulsionProposalsContextType } from "./types";

export const defaultExpulsionProposalsContext: ExpulsionProposalsContextType = {
  expulsionProposals: [],
  forRoster: () => [],
  againstSubject: () => [],
  byMotioner: () => [],
  secondedBy: () => [],
  refreshExpulsionProposals: () => {},
};
