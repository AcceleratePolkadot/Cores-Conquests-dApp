import { useBlocApiClient } from "@/contexts/BlocApiClient";
import type { BlocConstants } from "@polkadot-api/descriptors";
import type React from "react";
import { type ReactNode, createContext, useContext, useEffect, useState } from "react";
import type { RosterConstants, RosterConstantsContextType } from "./types";

const RosterConstantsContext = createContext<RosterConstantsContextType | undefined>(undefined);

export const useRosterConstants = () => {
  const context = useContext(RosterConstantsContext);
  if (!context) {
    throw new Error("useRosterConstants must be used within a RosterConstantsProvider");
  }
  return context;
};

export const RosterConstantsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { blocApi } = useBlocApiClient();
  const [rosterConstants, setRosterConstants] = useState<RosterConstants>({});

  useEffect(() => {
    syncRosterConstants();
  }, []);

  const syncRosterConstants = async () => {
    const constantValues: RosterConstants = {};

    // TODO: There must be a way to get this from PAPI or chain Metadata?
    const constantNames = [
      "PalletId",
      "NewRosterDeposit",
      "TitleMaxLength",
      "MembersMax",
      "NewNominationDeposit",
      "MembershipDues",
      "NominationVotesMax",
      "NominationVotingPeriod",
      "QuorumModifier",
      "QuorumMin",
      "NominationsPerRosterMax",
      "ConcludedNominationsMax",
      "NewExpulsionProposalDeposit",
      "ExpulsionProposalReparations",
      "ExpulsionProposalAwaitingSecondPeriod",
      "ExpulsionProposalVotingPeriod",
      "ExpulsionProposalsPerRosterMax",
      "ExpulsionProposalSecondThreshold",
      "SecondsMax",
      "ExpulsionReasonMaxLength",
      "ExpulsionReasonMinLength",
      "ExpulsionProposalVotesMax",
      "ConcludedExpulsionProposalsMax",
      "ExpulsionProposalLockoutPeriod",
      "ExpulsionProposalSuperMajority",
      "ExpulsionProposalQuorum",
    ];

    for (const constantName of constantNames) {
      const c = constantName as keyof BlocConstants["Roster"];
      constantValues[c] = (await blocApi.constants.Roster[
        c
      ]()) as BlocConstants["Roster"][typeof c];
    }

    setRosterConstants(constantValues);
  };

  return (
    <RosterConstantsContext.Provider
      value={{
        rosterConstants,
      }}
    >
      {children}
    </RosterConstantsContext.Provider>
  );
};
