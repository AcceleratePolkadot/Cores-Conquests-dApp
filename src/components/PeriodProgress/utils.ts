import type { CalculateProgressProps, Periods } from "./types";

export const calculateProgress = ({
  periodStart,
  periodDuration,
  currentBlock,
}: CalculateProgressProps): Periods => {
  const periodEnd = periodStart + periodDuration;
  const periodRemaining = periodEnd - currentBlock;
  const percentPassed =
    periodRemaining <= 0 ? 100 : Math.floor(100 - (periodRemaining / periodDuration) * 100);

  return {
    periodStart,
    periodDuration,
    periodEnd,
    periodRemaining,
    percentPassed,
  };
};
