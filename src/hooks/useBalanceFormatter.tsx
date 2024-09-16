import { useChainProperties } from "@/contexts/ChainProperties";
import { formatBalance } from "@polkadot/util";
import type { BigNumber } from "bignumber.js";
import { useCallback, useEffect } from "react";

const useBalanceFormatter = (withSi = true, forceUnit = undefined) => {
  const { chainProperties, syncChainProperties } = useChainProperties();

  useEffect(() => {
    if (!chainProperties) {
      (async () => {
        await syncChainProperties();
      })();
    } else {
      formatBalance.setDefaults({ unit: chainProperties.tokenSymbol });
    }
  }, [chainProperties, syncChainProperties]);

  const balanceFormatter = useCallback(
    (balance: BigNumber) => {
      return formatBalance(balance.toString(), {
        decimals: chainProperties?.tokenDecimals,
        withSi: withSi,
        forceUnit: forceUnit,
        withZero: false,
      });
    },
    [chainProperties, withSi, forceUnit],
  );

  return { balanceFormatter };
};

export default useBalanceFormatter;
