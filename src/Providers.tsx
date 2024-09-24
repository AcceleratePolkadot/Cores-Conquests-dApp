import { AccountsProvider } from "@/contexts/Accounts";
import { BalancesProvider } from "@/contexts/Balances";
import { BlocApiClientProvider } from "@/contexts/BlocApiClient";
import { BlocksProvider } from "@/contexts/Blocks";
import { ChainPropertiesProvider } from "@/contexts/ChainProperties";
import { ExpulsionProposalsProvider } from "@/contexts/ExpulsionProposals";
import { InjectedExtensionsProvider } from "@/contexts/InjectedExtensions";
import { NominationsProvider } from "@/contexts/Nominations";
import { NotificationsProvider } from "@/contexts/Notifications";
import { PalletsConstantsProvider } from "@/contexts/PalletsConstants";
import { RostersProvider } from "@/contexts/Rosters";
import type { BlocConstants } from "@polkadot-api/descriptors";
import { ExtensionAccountsProvider, ExtensionsProvider } from "@w3ux/react-connect-kit";
import { SnackbarProvider } from "notistack";
import type React from "react";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <SnackbarProvider>
      <NotificationsProvider>
        <ExtensionsProvider>
          <ExtensionAccountsProvider network="bloc" dappName="Cores and Conquests">
            <InjectedExtensionsProvider>
              <AccountsProvider>
                <BlocApiClientProvider>
                  <PalletsConstantsProvider
                    palletConstantsList={{
                      ["Roster" as keyof BlocConstants]: [
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
                      ],
                    }}
                  >
                    <BlocksProvider>
                      <ChainPropertiesProvider>
                        <BalancesProvider>
                          <RostersProvider>
                            <NominationsProvider>
                              <ExpulsionProposalsProvider>{children}</ExpulsionProposalsProvider>
                            </NominationsProvider>
                          </RostersProvider>
                        </BalancesProvider>
                      </ChainPropertiesProvider>
                    </BlocksProvider>
                  </PalletsConstantsProvider>
                </BlocApiClientProvider>
              </AccountsProvider>
            </InjectedExtensionsProvider>
          </ExtensionAccountsProvider>
        </ExtensionsProvider>
      </NotificationsProvider>
    </SnackbarProvider>
  );
};

export default Providers;
