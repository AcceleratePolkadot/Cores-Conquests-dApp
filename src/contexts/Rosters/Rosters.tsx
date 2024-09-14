import { useAccounts } from "@/contexts/Accounts";
import { useBlocApiClient } from "@/contexts/BlocApiClient";
import type React from "react";
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { AccountId, EventSubscriptions, Roster, RosterId, RostersContextType } from "./types";
const RostersContext = createContext<RostersContextType | undefined>(undefined);

export const useRosters = () => {
  const context = useContext(RostersContext);
  if (!context) {
    throw new Error("useRosters must be used within a RostersProvider");
  }
  return context;
};

export const RostersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { blocApi } = useBlocApiClient();
  const { activeAccount } = useAccounts();
  const [rosters, setRosters] = useState<Roster[]>([]);
  const [activeRoster, setActiveRoster] = useState<Roster | undefined>(undefined);

  const currentActiveAccount = useRef(activeAccount);

  const rosterEventSubscriptions: EventSubscriptions = useMemo(
    () => ({
      NewRoster: blocApi.event.Roster.NewRoster.watch().subscribe(async () => {
        await refreshRosters();
      }),
      RosterRemoved: blocApi.event.Roster.RosterRemoved.watch().subscribe(() => {
        refreshRosters();
      }),
      RosterStatusChanged: blocApi.event.Roster.RosterStatusChanged.watch().subscribe(() => {
        refreshRosters();
      }),
    }),
    [
      blocApi.event.Roster.NewRoster,
      blocApi.event.Roster.RosterRemoved,
      blocApi.event.Roster.RosterStatusChanged,
    ],
  );

  useEffect(() => {
    // Reset active roster if the active account changes
    if (!activeAccount || activeAccount.address !== currentActiveAccount.current?.address) {
      setActiveRoster(undefined);
      currentActiveAccount.current = activeAccount;
    }
  }, [activeAccount]);

  useEffect(() => {
    refreshRosters();
  }, []);

  const refreshRosters = async () => {
    const allRosters = await blocApi.query.Roster.Rosters.getEntries();
    setRosters(allRosters.map((roster) => roster.value));
  };

  const getRoster = (rosterId: RosterId) => {
    return rosters.find((roster) => roster.id.asHex() === rosterId.asHex());
  };

  const foundedBy = (account: AccountId) => {
    return rosters.filter((roster) => roster.founder === account);
  };

  const memberOf = (account: AccountId) => {
    return rosters.filter((roster) => roster.members.includes(account));
  };

  return (
    <RostersContext.Provider
      value={{
        rosters,
        activeRoster,
        setActiveRoster,
        getRoster,
        foundedBy,
        memberOf,
        rosterEventSubscriptions,
        refreshRosters,
      }}
    >
      {children}
    </RostersContext.Provider>
  );
};
