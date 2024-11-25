import _ from "lodash";
import type { Nomination } from "./types";

// can't just use lodash isEqual because it uses strict equality on functions
export const isEqual = (a: Nomination[], b: Nomination[]) => {
  const $a = a.map((nomination) => ({
    ...nomination,
    roster: nomination.roster.asHex(),
  }));
  const $b = b.map((nomination) => ({
    ...nomination,
    roster: nomination.roster.asHex(),
  }));
  return _.isEqual($a, $b);
};
