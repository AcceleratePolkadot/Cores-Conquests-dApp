import { useBlocApiClient } from "@/contexts/BlocApiClient";
import { useRosters } from "@/contexts/Rosters";
import type { AccountId, RosterId } from "@/contexts/Rosters/types";
import type React from "react";
import { type ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import type { EventSubscriptions, Nomination, NominationsContextType } from "./types";

const NominationsContext = createContext<NominationsContextType | undefined>(undefined);

export const useNominations = () => {
  const context = useContext(NominationsContext);
  if (!context) {
    throw new Error("useNominations must be used within a NominationsProvider");
  }
  return context;
};

export const NominationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { blocApi } = useBlocApiClient();
  const { refreshRosters } = useRosters();
  const [nominations, setNominations] = useState<Nomination[]>([]);

  const nominationEventSubscriptions: EventSubscriptions = useMemo(
    () => ({
      NewNomination: blocApi.event.Roster.NewNomination.watch().subscribe(async () => {
        await refreshNominations();
        await refreshRosters(); // Adding a nomination will also modify a roster
      }),
      NominationClosed: blocApi.event.Roster.NominationClosed.watch().subscribe(async () => {
        await refreshNominations();
        await refreshRosters(); // Closing a nomination will also modify a roster
      }),
      Voted: blocApi.event.Roster.Voted.watch().subscribe(async () => {
        await refreshNominations();
      }),
      VoteRecanted: blocApi.event.Roster.VoteRecanted.watch().subscribe(async () => {
        await refreshNominations();
      }),
    }),
    [
      blocApi.event.Roster.NewNomination,
      blocApi.event.Roster.NominationClosed,
      blocApi.event.Roster.Voted,
      blocApi.event.Roster.VoteRecanted,
      refreshRosters,
    ],
  );

  useEffect(() => {
    refreshNominations();
  }, []);

  const refreshNominations = async () => {
    const allNominations = await blocApi.query.Roster.Nominations.getEntries();
    setNominations(allNominations.map((nomination) => nomination.value));
  };

  const toRoster = (rosterId: RosterId) => {
    return nominations.filter((nomination) => nomination.roster === rosterId);
  };

  const forNominee = (nominee: AccountId) => {
    return nominations.filter((nomination) => nomination.nominee === nominee);
  };

  const byNominator = (nominator: AccountId) => {
    return nominations.filter((nomination) => nomination.nominator === nominator);
  };

  const approvedForNominee = (nominee: AccountId) => {
    return forNominee(nominee).filter((nomination) => nomination.status.type === "Approved");
  };

  const pendingForNominee = (nominee: AccountId) => {
    return forNominee(nominee).filter((nomination) => nomination.status.type === "Pending");
  };

  return (
    <NominationsContext.Provider
      value={{
        nominations,
        toRoster,
        forNominee,
        byNominator,
        approvedForNominee,
        pendingForNominee,
        nominationEventSubscriptions,
        refreshNominations,
      }}
    >
      {children}
    </NominationsContext.Provider>
  );
};
