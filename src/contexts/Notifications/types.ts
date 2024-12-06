import type { MutationError } from "@reactive-dot/core";
import type { OptionsObject, SnackbarKey, SnackbarMessage } from "notistack";
import type { TxEvent } from "polkadot-api";

import type { MutationNotificationProps } from "@/components/Notifications/Mutation/types";

declare module "notistack" {
  interface VariantOverrides {
    mutationPending: MutationNotificationProps;
    mutationFailure: MutationNotificationProps;
    mutationSuccess: MutationNotificationProps;
    mutationStatusChanged: MutationNotificationProps;
  }
}

export type NotificationKey = SnackbarKey;

export type Notification = {
  message: SnackbarMessage;
  options?: OptionsObject;
};

export type StatusNotification = {
  status: symbol | TxEvent | MutationError;
  pending: {
    message: SnackbarMessage;
    options?: OptionsObject;
  };
  success: {
    message: SnackbarMessage;
    options?: OptionsObject;
  };
  failure: {
    message: SnackbarMessage;
    options?: OptionsObject;
  };
};

export interface NotificationsContextType {
  showNotification: (notification: Notification) => NotificationKey;
  showStatusNotification: (notification: StatusNotification) => NotificationKey;
  updateStatusNotification: (key: NotificationKey, status: StatusNotification["status"]) => void;
}
