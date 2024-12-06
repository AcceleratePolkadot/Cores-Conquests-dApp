import _ from "lodash";

import type { Roster } from "./types";

// can't just use lodash isEqual because it uses strict equality on functions
export const isEqual = (a: Roster[], b: Roster[]) => {
  const $a = a.map((roster) => ({
    ...roster,
    id: roster.id.asHex(),
    title: roster.title.asText(),
  }));
  const $b = b.map((roster) => ({
    ...roster,
    id: roster.id.asHex(),
    title: roster.title.asText(),
  }));
  return _.isEqual($a, $b);
};
