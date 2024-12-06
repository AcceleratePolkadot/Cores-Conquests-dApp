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

import { useLazyLoadQueryWithRefresh } from "@reactive-dot/react";

import type { Address } from "@/contexts/ActiveAccount/types";
import { useRosters } from "@/contexts/Rosters";
import type { RosterId } from "@/contexts/Rosters/types";

import { isEqual } from "./utils";

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
    const $nominations = _nominations.map((nomination) => nomination.value);
    if (!isEqual($nominations, currentNominations.current)) {
      currentNominations.current = $nominations;
      setNominations($nominations);
    }
  }, [_nominations]);

  useEffect(() => {
    if (nominations !== currentNominations.current) {
      // If nominations have changed then a Roster will have changed
      refreshRosters();
      currentNominations.current = nominations;
    }
  }, [nominations, refreshRosters]);

  const toRoster = useCallback(
    (rosterId: RosterId) => {
      return nominations.filter((nomination) => nomination.roster.asHex() === rosterId.asHex());
    },
    [nominations],
  );

  const forNominee = useCallback(
    (nominee: Address) => {
      return nominations.filter((nomination) => nomination.nominee === nominee);
    },
    [nominations],
  );

  const byNominator = useCallback(
    (nominator: Address) => {
      return nominations.filter((nomination) => nomination.nominator === nominator);
    },
    [nominations],
  );

  const approvedForNominee = useCallback(
    (nominee: Address) => {
      return forNominee(nominee).filter((nomination) => nomination.status.type === "Approved");
    },
    [forNominee],
  );

  const pendingForNominee = useCallback(
    (nominee: Address) => {
      return forNominee(nominee).filter((nomination) => nomination.status.type === "Pending");
    },
    [forNominee],
  );

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
