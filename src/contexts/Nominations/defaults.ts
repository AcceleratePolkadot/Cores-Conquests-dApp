import type { NominationsContextType } from "./types";

export const defaultNominationsContext: NominationsContextType = {
  nominations: [],
  toRoster: () => [],
  forNominee: () => [],
  byNominator: () => [],
  approvedForNominee: () => [],
  pendingForNominee: () => [],
  refreshNominations: () => {},
};
