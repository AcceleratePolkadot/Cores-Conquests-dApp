import { useRosters } from "@/contexts/Rosters";
import type { RosterId } from "@/contexts/Rosters/types";
import type { WalletAccount } from "@reactive-dot/core/wallets.js";
import { useLazyLoadQueryWithRefresh } from "@reactive-dot/react";
import type React from "react";
import { type ReactNode, createContext, useContext, useEffect, useRef, useState } from "react";
import { defaultNominationsContext } from "./defaults";
import type { Nomination, NominationsContextType } from "./types";

const NominationsContext = createContext<NominationsContextType>(defaultNominationsContext);

export const useNominations = () => {
  const context = useContext(NominationsContext);
  if (!context) {
    throw new Error("useNominations must be used within a NominationsProvider");
  }
  return context;
};

export const NominationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { refreshRosters } = useRosters();
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [_nominations, refreshNominations] = useLazyLoadQueryWithRefresh((builder) =>
    builder.readStorageEntries("Roster", "Nominations", []),
  );

  const currentNominations = useRef<Nomination[]>([]);

  useEffect(() => {
    const refresh = setInterval(() => {
      refreshNominations();
    }, 10000);
    return () => clearInterval(refresh);
  }, [refreshNominations]);

  useEffect(() => {
    setNominations(_nominations.map((nomination) => nomination.value));
  }, [_nominations]);

  useEffect(() => {
    if (nominations !== currentNominations.current) {
      // If nominations have changed then a Roster will have changed
      refreshRosters();
      currentNominations.current = nominations;
    }
  }, [nominations, refreshRosters]);

  const toRoster = (rosterId: RosterId) => {
    return nominations.filter((nomination) => nomination.roster.asHex() === rosterId.asHex());
  };

  const forNominee = (nominee: WalletAccount) => {
    return nominations.filter((nomination) => nomination.nominee === nominee.address);
  };

  const byNominator = (nominator: WalletAccount) => {
    return nominations.filter((nomination) => nomination.nominator === nominator.address);
  };

  const approvedForNominee = (nominee: WalletAccount) => {
    return forNominee(nominee).filter((nomination) => nomination.status.type === "Approved");
  };

  const pendingForNominee = (nominee: WalletAccount) => {
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
        refreshNominations,
      }}
    >
      {children}
    </NominationsContext.Provider>
  );
};
