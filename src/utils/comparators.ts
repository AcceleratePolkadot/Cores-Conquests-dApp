import { MutationError } from "@reactive-dot/core";
import type { TxEvent } from "polkadot-api";

import type { StatusNotification } from "@/contexts/Notifications/types";

const mutationStateIsEqual = (a: StatusNotification["status"], b: StatusNotification["status"]) => {
  if (a === b) return true;
  if (a instanceof MutationError && b instanceof MutationError && mutationErrorIsEqual(a, b))
    return true;
  if (
    (a as TxEvent).type !== undefined &&
    (b as TxEvent).type !== undefined &&
    (a as TxEvent).type === (b as TxEvent).type
  )
    return true;
  return false;
};

const mutationErrorIsEqual = (a: MutationError, b: MutationError) => {
  return a.message === b.message && a.name === b.name && a.cause === b.cause && a.stack === b.stack;
};

export const comparators = {
  mutationStateIsEqual,
  mutationErrorIsEqual,
};
