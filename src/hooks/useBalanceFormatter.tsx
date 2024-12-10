import { useCallback } from "react";

import { formatBalance } from "@polkadot/util";
import { useChainSpecData } from "@reactive-dot/react";
import type { BigNumber } from "bignumber.js";

const useBalanceFormatter = (withSi = true) => {
  const chainSpecData = useChainSpecData();

  const balanceFormatter = useCallback(
    (balance: BigNumber) => {
      formatBalance.setDefaults({
        unit: chainSpecData.properties.tokenSymbol,
        decimals: chainSpecData.properties.tokenDecimals,
      });
      return formatBalance(balance.toString(), {
        decimals: chainSpecData.properties.tokenDecimals,
        withSi: withSi,
        withZero: false,
        withUnit: true,
      });
    },
    [chainSpecData, withSi],
  );

  return { balanceFormatter };
};

export default useBalanceFormatter;
