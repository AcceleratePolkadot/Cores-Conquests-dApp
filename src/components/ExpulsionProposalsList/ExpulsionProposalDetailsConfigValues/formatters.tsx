import { calculateProgress } from "@/components/PeriodProgress/utils";
import clsx from "clsx";

import { PercentageOdometer } from "@/components/Odometers";

const minute = 60 * 1000;
const hour = 60 * minute;
const day = 24 * hour;
const week = 7 * day;
const month = 30 * day;
const year = 365 * day;

const formatReparations = (reparations: number, tokenAmount: string) => {
  return {
    label: "Reparations",
    value: (
      <span
        className={clsx("flex", {
          "text-emerald-500": reparations < 30,
          "text-amber-500": reparations > 30 && reparations < 75,
          "text-red-500": reparations >= 75,
        })}
      >
        <PercentageOdometer value={reparations} />
      </span>
    ),
    subLabel: <span className="text-xs italic opacity-80">{tokenAmount}</span>,
  };
};

const formatLockoutPeriod = (lockoutPeriod: number, slotDuration: number | bigint) => {
  const lockoutPeriodInMilliseconds = BigInt(lockoutPeriod) * BigInt(slotDuration);

  return {
    label: "Lockout Period",
    value: (
      <span
        className={clsx({
          "text-emerald-500": lockoutPeriodInMilliseconds < day,
          "text-sky-500": lockoutPeriodInMilliseconds >= day && lockoutPeriodInMilliseconds < week,
          "text-purple-500":
            lockoutPeriodInMilliseconds >= week && lockoutPeriodInMilliseconds < month,
          "text-amber-500":
            lockoutPeriodInMilliseconds >= month && lockoutPeriodInMilliseconds < month * 3,
          "text-orange-500":
            lockoutPeriodInMilliseconds >= month * 3 && lockoutPeriodInMilliseconds < month * 6,
          "text-pink-700":
            lockoutPeriodInMilliseconds >= month * 6 && lockoutPeriodInMilliseconds < year,
          "text-red-500": lockoutPeriodInMilliseconds >= year,
        })}
      >
        {lockoutPeriod} blocks
      </span>
    ),
  };
};

const periodRemainingStr = (
  period: number,
  startingBlock: number | undefined,
  currentBlock: number,
  slotDuration: number | bigint,
) => {
  if (!startingBlock) {
    return <span className="text-emerald-400 text-xxs italic opacity-80">not started</span>;
  }
  const progress = calculateProgress({
    periodStart: startingBlock,
    periodDuration: period,
    currentBlock,
  });
  if (progress.periodRemaining <= 0) {
    return <span className="text-purple-400 text-xs">period ended</span>;
  }

  const periodRemainingInMilliSeconds = BigInt(progress.periodRemaining) * BigInt(slotDuration);

  return (
    <span
      className={clsx({
        "text-red-500": periodRemainingInMilliSeconds < minute,
        "text-pink-700":
          periodRemainingInMilliSeconds >= minute && periodRemainingInMilliSeconds < hour,
        "text-orange-500":
          periodRemainingInMilliSeconds >= hour && periodRemainingInMilliSeconds < day,
        "text-amber-500":
          periodRemainingInMilliSeconds >= day && periodRemainingInMilliSeconds < week,
        "text-purple-500":
          periodRemainingInMilliSeconds >= week && periodRemainingInMilliSeconds < month,
        "text-sky-500":
          periodRemainingInMilliSeconds >= month && periodRemainingInMilliSeconds < month * 3,
        "text-emerald-500":
          periodRemainingInMilliSeconds >= month * 3 && periodRemainingInMilliSeconds < month * 6,
      })}
    >
      {progress.periodRemaining} blocks remaining
    </span>
  );
};

export { formatReparations, formatLockoutPeriod, periodRemainingStr };
