import type { AccountId } from "@/contexts/Accounts/types";
import { useBlocApiClient } from "@/contexts/BlocApiClient";
import { useRosters } from "@/contexts/Rosters";
import type { RosterId } from "@/contexts/Rosters/types";
import type React from "react";
import { type ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import type { EventSubscriptions, ExpulsionProposal, ExpulsionProposalsContextType } from "./types";

const ExpulsionProposalsContext = createContext<ExpulsionProposalsContextType | undefined>(
  undefined,
);

export const useExpulsionProposals = () => {
  const context = useContext(ExpulsionProposalsContext);
  if (!context) {
    throw new Error("useExpulsionProposals must be used within a ExpulsionProposalsProvider");
  }
  return context;
};

export const ExpulsionProposalsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { blocApi } = useBlocApiClient();
  const { refreshRosters } = useRosters();
  const [expulsionProposals, setExpulsionProposals] = useState<ExpulsionProposal[]>([]);

  const expulsionProposalEventSubscriptions: EventSubscriptions = useMemo(
    () => ({
      NewExpulsionProposal: blocApi.event.Roster.NewExpulsionProposal.watch().subscribe(
        async () => {
          await refreshExpulsionProposals();
          await refreshRosters(); // Adding an expulsion proposal will also modify a roster
        },
      ),
      SeconderAddedToExpulsionProposal:
        blocApi.event.Roster.SeconderAddedToExpulsionProposal.watch().subscribe(async () => {
          await refreshExpulsionProposals();
        }),
      ExpulsionProposalDismissed: blocApi.event.Roster.ExpulsionProposalDismissed.watch().subscribe(
        async () => {
          await refreshExpulsionProposals();
          await refreshRosters(); // So will dismissing an expulsion proposal
        },
      ),
      ExpulsionProposalDismissedWithPrejudice:
        blocApi.event.Roster.ExpulsionProposalDismissedWithPrejudice.watch().subscribe(async () => {
          await refreshExpulsionProposals();
          await refreshRosters();
        }),
      ExpulsionProposalPassed: blocApi.event.Roster.ExpulsionProposalPassed.watch().subscribe(
        async () => {
          await refreshExpulsionProposals();
          await refreshRosters();
        },
      ),
      ExpulsionVoteOpened: blocApi.event.Roster.ExpulsionVoteOpened.watch().subscribe(async () => {
        await refreshExpulsionProposals();
      }),
      ExpulsionVoteRecanted: blocApi.event.Roster.ExpulsionVoteRecanted.watch().subscribe(
        async () => {
          await refreshExpulsionProposals();
        },
      ),
      ExpulsionVoteSubmitted: blocApi.event.Roster.ExpulsionVoteSubmitted.watch().subscribe(
        async () => {
          await refreshExpulsionProposals();
        },
      ),
    }),
    [
      blocApi.event.Roster.NewExpulsionProposal,
      blocApi.event.Roster.SeconderAddedToExpulsionProposal,
      blocApi.event.Roster.ExpulsionProposalDismissed,
      blocApi.event.Roster.ExpulsionProposalDismissedWithPrejudice,
      blocApi.event.Roster.ExpulsionProposalPassed,
      blocApi.event.Roster.ExpulsionVoteOpened,
      blocApi.event.Roster.ExpulsionVoteRecanted,
      blocApi.event.Roster.ExpulsionVoteSubmitted,
      refreshRosters,
    ],
  );

  useEffect(() => {
    refreshExpulsionProposals();
  }, []);

  const refreshExpulsionProposals = async () => {
    const allExpulsionProposals = await blocApi.query.Roster.ExpulsionProposals.getEntries();
    setExpulsionProposals(allExpulsionProposals.map((proposal) => proposal.value));
  };

  const forRoster = (rosterId: RosterId) => {
    return expulsionProposals.filter((proposal) => proposal.roster.asHex() === rosterId.asHex());
  };

  const againstSubject = (subject: AccountId) => {
    return expulsionProposals.filter((proposal) => proposal.subject === subject);
  };

  const byMotioner = (motioner: AccountId) => {
    return expulsionProposals.filter((proposal) => proposal.motioner === motioner);
  };

  const secondedBy = (seconder: AccountId) => {
    return expulsionProposals.filter((proposal) => proposal.seconds.includes(seconder));
  };

  return (
    <ExpulsionProposalsContext.Provider
      value={{
        expulsionProposals,
        forRoster,
        againstSubject,
        byMotioner,
        secondedBy,
        expulsionProposalEventSubscriptions,
        refreshExpulsionProposals,
      }}
    >
      {children}
    </ExpulsionProposalsContext.Provider>
  );
};
