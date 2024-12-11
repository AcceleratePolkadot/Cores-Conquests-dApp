import useBalanceFormatter, { type Numericable } from "@/hooks/useBalanceFormatter";
import { Odometer } from "@w3ux/react-odometer";
import type { FC } from "react";

import clsx from "clsx";

interface BaseOdometerProps {
  value: Numericable;
  className?: string;
}

const BalanceOdometer: FC<BaseOdometerProps> = ({ value, className }) => {
  const { formatBalanceWithOnlyUnit, formatBalanceWithoutUnit } = useBalanceFormatter();
  const balance = formatBalanceWithoutUnit(value);
  const unit = formatBalanceWithOnlyUnit(value);

  return (
    <div className={clsx("flex items-center", className)}>
      <Odometer value={balance} />
      <span className="ml-1">{unit}</span>
    </div>
  );
};

const PercentageOdometer: FC<BaseOdometerProps> = ({ value, className }) => {
  const { numerify } = useBalanceFormatter();

  return (
    <div className={clsx("flex items-start", className)}>
      <Odometer value={numerify(value).toString()} />
      <span className="-ml-2.5 -mt-1 scale-[0.7] font-sans opacity-80">﹪</span>
    </div>
  );
};

export { BalanceOdometer, PercentageOdometer };
