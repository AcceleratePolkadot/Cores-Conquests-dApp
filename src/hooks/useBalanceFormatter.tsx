import { useCallback } from "react";

import { formatBalance } from "@polkadot/util";
import { useChainSpecData } from "@reactive-dot/react";
import type { BigNumber } from "bignumber.js";

const useBalanceFormatter = (withSi = true, forceUnit = undefined) => {
  const chainSpecData = useChainSpecData();

  const balanceFormatter = useCallback(
    (balance: BigNumber) => {
      return formatBalance(balance.toString(), {
        decimals: chainSpecData.properties.tokenDecimals,
        withSi: withSi,
        forceUnit: forceUnit,
        withZero: false,
      });
    },
    [chainSpecData, withSi, forceUnit],
  );

  return { balanceFormatter };
};

export default useBalanceFormatter;
