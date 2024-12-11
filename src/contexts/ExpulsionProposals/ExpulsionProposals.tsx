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

import { defaultExpulsionProposalsContext } from "./defaults";
import type { ExpulsionProposal, ExpulsionProposalsContextType } from "./types";

const ExpulsionProposalsContext = createContext<ExpulsionProposalsContextType>(
  defaultExpulsionProposalsContext,
);

export const useExpulsionProposals = () => {
  const context = useContext(ExpulsionProposalsContext);
  if (!context) {
    throw new Error("useExpulsionProposals must be used within a ExpulsionProposalsProvider");
  }
  return context;
};

export const ExpulsionProposalsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { refreshRosters } = useRosters();
  const [expulsionProposals, setExpulsionProposals] = useState<ExpulsionProposal[]>([]);
  const [_expulsionProposals, refreshExpulsionProposals] = useLazyLoadQueryWithRefresh((builder) =>
    builder.readStorageEntries("Roster", "ExpulsionProposals", []),
  );

  const currentExpulsionProposals = useRef<ExpulsionProposal[]>([]);

  useEffect(() => {
    const refresh = setInterval(() => {
      refreshExpulsionProposals();
    }, 10000);
    return () => clearInterval(refresh);
  }, [refreshExpulsionProposals]);

  useEffect(() => {
    const $expulsionProposals = _expulsionProposals.map((proposal) => proposal.value);
    if (!isEqual($expulsionProposals, currentExpulsionProposals.current)) {
      currentExpulsionProposals.current = $expulsionProposals;
      setExpulsionProposals($expulsionProposals);
    }
  }, [_expulsionProposals]);

  useEffect(() => {
    if (expulsionProposals !== currentExpulsionProposals.current) {
      // If expulsion proposals have changed then a Roster will have changed
      refreshRosters();
      currentExpulsionProposals.current = expulsionProposals;
    }
  }, [expulsionProposals, refreshRosters]);

  const forRoster = useCallback(
    (rosterId: RosterId) => {
      return expulsionProposals.filter((proposal) => proposal.roster.asHex() === rosterId.asHex());
    },
    [expulsionProposals],
  );

  const againstSubject = useCallback(
    (subject: Address) => {
      return expulsionProposals.filter((proposal) => proposal.subject === subject);
    },
    [expulsionProposals],
  );

  const byMotioner = useCallback(
    (motioner: Address) => {
      return expulsionProposals.filter((proposal) => proposal.motioner === motioner);
    },
    [expulsionProposals],
  );

  const secondedBy = useCallback(
    (seconded: Address) => {
      return expulsionProposals.filter((proposal) =>
        proposal.seconds.some((second) => second === seconded),
      );
    },
    [expulsionProposals],
  );

  return (
    <ExpulsionProposalsContext.Provider
      value={{
        expulsionProposals,
        forRoster,
        againstSubject,
        byMotioner,
        secondedBy,
        refreshExpulsionProposals,
      }}
    >
      {children}
    </ExpulsionProposalsContext.Provider>
  );
};
