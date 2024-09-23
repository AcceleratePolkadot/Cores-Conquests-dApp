import type { FC } from "react";

import { Progress, Tooltip } from "flowbite-react";

import type { CustomTooltipProps, PeriodProgressProps } from "./types";
import { calculateProgress } from "./utils";

const CustomTooltipWrapper: FC<CustomTooltipProps> = ({ customTooltip, periods, children }) =>
  customTooltip ? <Tooltip content={customTooltip(periods)}>{children}</Tooltip> : children;

const PeriodProgress: FC<PeriodProgressProps> = ({
  periodStart,
  periodDuration,
  currentBlock,
  color,
  customTooltip,
  textLabel,
  labelProgress,
  ...props
}) => {
  const periods = calculateProgress({
    periodStart,
    periodDuration,
    currentBlock,
  });

  return (
    <CustomTooltipWrapper periods={periods} customTooltip={customTooltip}>
      <Progress
        {...props}
        progress={periods.percentPassed}
        color={typeof color === "function" ? color(periods) : color}
        textLabel={typeof textLabel === "function" ? textLabel(periods) : textLabel}
        labelProgress={typeof labelProgress === "function" ? labelProgress(periods) : labelProgress}
      />
    </CustomTooltipWrapper>
  );
};

export default PeriodProgress;
