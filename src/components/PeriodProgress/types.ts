import type { BlockNumber } from "@/contexts/Blocks/types";
import type { ProgressProps } from "flowbite-react";
import type { PropsWithChildren, ReactNode } from "react";

export type CustomTooltipProps = PropsWithChildren & {
  periods: Periods;
  customTooltip?: (periods: Periods) => ReactNode;
};

export interface PeriodProgressProps
  extends CalculateProgressProps,
    Omit<ProgressProps, "color" | "progress" | "textLabel" | "labelProgress"> {
  color?: ((periods: Periods) => string) | undefined;
  customTooltip?: (periods: Periods) => ReactNode;
  textLabel?: string | ((periods: Periods) => string);
  labelProgress?: boolean | ((periods: Periods) => boolean);
}

export interface CalculateProgressProps {
  periodStart: BlockNumber;
  periodDuration: number;
  currentBlock: BlockNumber;
}

export type Periods = {
  periodStart: BlockNumber;
  periodDuration: number;
  periodEnd: BlockNumber;
  periodRemaining: number;
  percentPassed: number;
};
