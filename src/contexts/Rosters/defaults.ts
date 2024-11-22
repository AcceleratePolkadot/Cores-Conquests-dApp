import type { RostersContextType } from "./types";

export const defaultRostersContext: RostersContextType = {
  rosters: [],
  activeRoster: undefined,
  setActiveRoster: () => {},
  getRoster: () => undefined,
  foundedBy: () => [],
  memberOf: () => [],
  refreshRosters: () => {},
};
