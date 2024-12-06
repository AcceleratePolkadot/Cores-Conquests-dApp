import { MutationError, idle, pending } from "@reactive-dot/core";
import _ from "lodash";
import { useSnackbar } from "notistack";
import type { OptionsObject } from "notistack";
import type {
  TxBestBlocksState,
  TxEvent,
  TxFinalized,
  TxInBestBlocksFound,
  TxInBestBlocksNotFound,
} from "polkadot-api";
import type React from "react";
import { type ReactNode, createContext, useContext, useEffect, useState } from "react";
import { MdError } from "react-icons/md";
import type {
  Notification,
  NotificationKey,
  NotificationsContextType,
  StatusNotification,
} from "./types";

import { defaultNotificationsContext, defaultOptions } from "./defaults";

const NotificationsContext = createContext<NotificationsContextType>(defaultNotificationsContext);

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }
  return context;
};

export const NotificationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const [statusNotifications, setStatusNotifications] = useState<
    Record<NotificationKey, StatusNotification>
  >({});

  const generateNotificationKey = () => {
    return _.uniqueId("notification-");
  };

  useEffect(() => {
    _.each(statusNotifications, (notification, key) => {
      if (
        notification.status !== pending &&
        notification.status !== idle &&
        (notification.status instanceof MutationError ||
          (notification.status as TxEvent).type === "finalized")
      ) {
        closeSnackbar(key);
        setStatusNotifications((prev) => _.omit(prev, key));

        if (notification.status instanceof MutationError) {
          showNotification({
            message: notification.failure.message,
            options: {
              persist: true,
              variant: "mutationFailure",
              icon: <MdError />,
              error:
                notification.status.cause instanceof Object
                  ? {
                      message:
                        "message" in notification.status.cause
                          ? notification.status.cause.message
                          : undefined,
                      stack:
                        "stack" in notification.status.cause
                          ? notification.status.cause.stack
                          : undefined,
                    }
                  : undefined,
              ...notification.failure.options,
            } as OptionsObject<"mutationFailure">,
          });
        } else {
          const txFinalized = notification.status as TxFinalized;
          if (!txFinalized.ok) {
            showNotification({
              message: notification.failure.message,
              options: {
                persist: true,
                variant: "mutationFailure",
                icon: <MdError />,
                dispatchError: txFinalized.dispatchError,
                events: txFinalized.events,
                block: txFinalized.block,
                ...notification.failure.options,
              } as OptionsObject<"mutationFailure">,
            });
          } else {
            showNotification({
              message: notification.success.message,
              options: {
                persist: true,
                variant: "mutationSuccess",
                events: txFinalized.events,
                block: txFinalized.block,
                ...notification.success.options,
              } as OptionsObject<"mutationSuccess">,
            });
          }
        }
      } else {
        if (!(notification.status instanceof Symbol) && (notification.status as TxEvent).type) {
          const options = {
            variant: "mutationStatusChanged",
            txHash: (notification.status as TxEvent).txHash,
          } as OptionsObject<"mutationStatusChanged">;

          const txEventStatus = notification.status as TxEvent;

          if (txEventStatus.type === "signed") {
            showNotification({
              message: "Transaction signed",
              options,
            });
          } else if (txEventStatus.type === "broadcasted") {
            showNotification({
              message: "Transaction broadcasted",
              options,
            });
          } else if (txEventStatus.type === "txBestBlocksState") {
            const txBestBlocksStatus = notification.status as TxBestBlocksState;
            if (txBestBlocksStatus.found) {
              const txInBestBlocksFoundStatus = notification.status as TxInBestBlocksFound;
              showNotification({
                message: `Transaction found in block ${txBestBlocksStatus.block.number}${
                  txInBestBlocksFoundStatus.ok ? " and is okay" : ", but it is failing"
                }`,
                options: {
                  ...options,
                  events: txInBestBlocksFoundStatus.events,
                  block: txInBestBlocksFoundStatus.block,
                  found: txInBestBlocksFoundStatus.found,
                  ok: txInBestBlocksFoundStatus.ok,
                } as OptionsObject<"mutationStatusChanged">,
              });
            } else {
              const txInBestBlocksNotFoundStatus = notification.status as TxInBestBlocksNotFound;
              showNotification({
                message: `Transaction not found in block${
                  txInBestBlocksNotFoundStatus.isValid ? ", but it is valid" : " and is invalid"
                }`,
                options: {
                  ...options,
                  isValid: txInBestBlocksNotFoundStatus.isValid,
                } as OptionsObject<"mutationStatusChanged">,
              });
            }
          }
        }
      }
    });
  }, [statusNotifications, closeSnackbar]);

  const showNotification = (notification: Notification) => {
    const key = generateNotificationKey();
    enqueueSnackbar(notification.message, {
      key,
      ...defaultOptions,
      ...notification.options,
    });
    return key;
  };

  const showStatusNotification = (notification: StatusNotification) => {
    const key = showNotification({
      message: notification.pending.message,
      options: { ...notification.pending.options, persist: true, variant: "mutationPending" },
    });
    setStatusNotifications((prev) => ({
      ...prev,
      [key]: {
        ...notification,
        status: pending,
      },
    }));
    return key;
  };

  const updateStatusNotification = (key: NotificationKey, status: StatusNotification["status"]) => {
    const notification = _.get(statusNotifications, key);
    if (notification) {
      setStatusNotifications((prev) => ({
        ...prev,
        [key]: { ...notification, status },
      }));
    }
  };

  return (
    <NotificationsContext.Provider
      value={{
        showNotification,
        showStatusNotification,
        updateStatusNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
