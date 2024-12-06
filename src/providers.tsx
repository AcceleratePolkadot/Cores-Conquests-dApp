import type React from "react";
import { Suspense } from "react";

import { SnackbarProvider } from "notistack";

import { ActiveAccountProvider } from "@/contexts/ActiveAccount";
import { NominationsProvider } from "@/contexts/Nominations";
import { NotificationsProvider } from "@/contexts/Notifications";
import { RostersProvider } from "@/contexts/Rosters";

import {
  MutationFailureNotification,
  MutationPendingNotification,
  MutationStatusChangedNotification,
  MutationSuccessNotification,
} from "@/components/Notifications";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <SnackbarProvider
      Components={{
        mutationPending: MutationPendingNotification,
        mutationFailure: MutationFailureNotification,
        mutationSuccess: MutationSuccessNotification,
        mutationStatusChanged: MutationStatusChangedNotification,
      }}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <NotificationsProvider>
          <ActiveAccountProvider>
            <RostersProvider>
              <NominationsProvider>{children}</NominationsProvider>
            </RostersProvider>
          </ActiveAccountProvider>
        </NotificationsProvider>
      </Suspense>
    </SnackbarProvider>
  );
};

export default Providers;
