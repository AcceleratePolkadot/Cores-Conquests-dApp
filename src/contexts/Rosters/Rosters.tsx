import type React from "react";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import type { WalletAccount } from "@reactive-dot/core/wallets.js";
import { useLazyLoadQueryWithRefresh } from "@reactive-dot/react";

import { useActiveAccount } from "@/contexts/ActiveAccount";

import { isEqual } from "./utils";

import { defaultRostersContext } from "./defaults";

import type { Roster, RosterId, RostersContextType } from "./types";

const RostersContext = createContext<RostersContextType>(defaultRostersContext);

export const useRosters = () => {
  const context = useContext(RostersContext);
  if (!context) {
    throw new Error("useRosters must be used within a RostersProvider");
  }
  return context;
};

export const RostersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { activeAccount } = useActiveAccount();
  const [activeRoster, setActiveRoster] = useState<Roster | undefined>(undefined);

  const [_rosters, refreshRosters] = useLazyLoadQueryWithRefresh((builder) =>
    builder.readStorageEntries("Roster", "Rosters", []),
  );

  const [rosters, setRosters] = useState<Roster[]>([]);

  const currentActiveAccount = useRef(activeAccount);
  const currentRosters = useRef<Roster[]>([]);

  useEffect(() => {
    const refresh = setInterval(() => {
      refreshRosters();
    }, 10000);
    return () => clearInterval(refresh);
  }, [refreshRosters]);

  useEffect(() => {
    const $rosters = _rosters.map((roster) => roster.value);
    if (!isEqual($rosters, currentRosters.current)) {
      currentRosters.current = $rosters;
      setRosters($rosters);
    }
  }, [_rosters]);

  useEffect(() => {
    // If Rosters change we might need to update the active roster
    if (activeRoster) {
      const roster = rosters.find((roster) => roster.id.asHex() === activeRoster.id.asHex());
      if (!roster) {
        setActiveRoster(undefined);
      } else if (!isEqual([roster], [activeRoster])) {
        setActiveRoster(roster);
      }
    }
  }, [rosters, activeRoster]);

  useEffect(() => {
    // Reset active roster if the active account changes
    if (!activeAccount || activeAccount.address !== currentActiveAccount.current?.address) {
      setActiveRoster(undefined);
      currentActiveAccount.current = activeAccount;
    }
  }, [activeAccount]);

  const getRoster = useCallback(
    (rosterId: RosterId) => {
      return rosters.find((roster) => roster.id.asHex() === rosterId.asHex());
    },
    [rosters],
  );

  const foundedBy = useCallback(
    (account: WalletAccount) => {
      return rosters.filter((roster) => roster.founder === account.address);
    },
    [rosters],
  );

  const memberOf = useCallback(
    (account: WalletAccount) => {
      return rosters.filter((roster) => roster.members.includes(account.address));
    },
    [rosters],
  );

  return (
    <RostersContext.Provider
      value={{
        rosters,
        activeRoster,
        setActiveRoster,
        getRoster,
        foundedBy,
        memberOf,
        refreshRosters,
      }}
    >
      {children}
    </RostersContext.Provider>
  );
};
