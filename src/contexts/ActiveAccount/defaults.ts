import type { ActiveAccountContextInterface } from "./types";

export const defaultActiveAccountContext: ActiveAccountContextInterface = {
  activeAccount: undefined,
  setActiveAccount: () => {},
};
