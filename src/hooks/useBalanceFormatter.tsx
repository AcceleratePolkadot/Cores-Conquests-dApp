import { useCallback, useMemo } from "react";

import { formatBalance as polkadotFormatBalance } from "@polkadot/util";
import { useChainSpecData } from "@reactive-dot/react";
import { BigNumber } from "bignumber.js";

export type Numericable = BigNumber | bigint | number | string | boolean | null | undefined;

interface BalanceFormatterOptions {
  withSi?: boolean;
  withSiFull?: boolean;
  withUnit?: boolean;
  forceUnit?: string;
  withZero?: boolean;
  locale?: string;
}

interface BalanceFormatterReturn {
  unit: string;
  decimals: number;
  tokenSymbol: string;
  numerify: (n: Numericable) => number | bigint | string;
  formatBalance: (balance: Numericable) => string;
  formatBalanceWithoutUnit: (balance: Numericable) => string;
  formatBalanceWithOnlyUnit: (balance: Numericable) => string;
}

const useBalanceFormatter = ({
  withSi = true,
  withUnit = true,
  withZero = false,
  forceUnit = undefined,
  locale = undefined,
  withSiFull = false,
}: BalanceFormatterOptions = {}): BalanceFormatterReturn => {
  const chainSpecData = useChainSpecData();

  const options = useMemo(
    () => ({
      decimals: chainSpecData.properties.tokenDecimals,
      withSi,
      withZero,
      withUnit,
      forceUnit,
      locale,
      withSiFull,
    }),
    [
      chainSpecData.properties.tokenDecimals,
      withSi,
      withZero,
      withUnit,
      forceUnit,
      locale,
      withSiFull,
    ],
  );

  const numerify = useCallback((n: Numericable): number | bigint | string => {
    if (["string", "number", "bigint"].includes(typeof n)) return n as string | number | bigint;
    if (n instanceof BigNumber) return n.toString();
    return Number.isNaN(Number(n)) ? "0" : Number(n);
  }, []);

  const formatBalance = useCallback(
    (balance: Numericable) => {
      polkadotFormatBalance.setDefaults({
        unit: chainSpecData.properties.tokenSymbol,
      });
      return polkadotFormatBalance(numerify(balance), options);
    },
    [chainSpecData, numerify, options],
  );

  const formatBalanceWithoutUnit = useCallback(
    (balance: Numericable) => {
      polkadotFormatBalance.setDefaults({
        unit: undefined,
      });
      return polkadotFormatBalance(numerify(balance), {
        ...options,
        withUnit: false,
        forceUnit: undefined,
        withSi: false,
        withSiFull: false,
      });
    },
    [numerify, options],
  );

  const formatBalanceWithOnlyUnit = useCallback(
    (balance: Numericable) => {
      polkadotFormatBalance.setDefaults({
        unit: chainSpecData.properties.tokenSymbol,
      });
      const formatedWithUnit = polkadotFormatBalance(numerify(balance), {
        ...options,
        // if forceUnit is undefined, we must show the unit
        withUnit: options.forceUnit === undefined ? true : options.withUnit,
        // if withSiFull is false, then withSi must be true
        withSi: !options.withSiFull,
      });

      const formattedWithoutUnit = formatBalanceWithoutUnit(balance);

      return formatedWithUnit.replace(formattedWithoutUnit, "");
    },
    [chainSpecData, numerify, formatBalanceWithoutUnit, options],
  );

  return {
    unit: chainSpecData.properties.tokenSymbol,
    decimals: chainSpecData.properties.tokenDecimals,
    tokenSymbol: chainSpecData.properties.tokenSymbol,
    numerify,
    formatBalance,
    formatBalanceWithoutUnit,
    formatBalanceWithOnlyUnit,
  };
};

export default useBalanceFormatter;
