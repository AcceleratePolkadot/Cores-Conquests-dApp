import type { OptionsObject, SnackbarKey } from "notistack";
import type React from "react";
import { type ReactNode, createContext, useContext } from "react";
import type { NotificationsContextType, ShowNotificationInterface } from "./types";

import { useSnackbar } from "notistack";

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

const defaultOptions = {
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "right",
  },
  autoHideDuration: 5000,
} as OptionsObject;

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }
  return context;
};

export const NotificationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const showNotification = ({ message, options }: ShowNotificationInterface) => {
    const key: SnackbarKey = enqueueSnackbar(message, {
      ...defaultOptions,
      ...options,
    });
    return key;
  };

  const hideNotification = (key: SnackbarKey) => {
    closeSnackbar(key);
  };

  const hideAllNotifications = () => {
    closeSnackbar();
  };

  return (
    <NotificationsContext.Provider
      value={{
        showNotification,
        hideNotification,
        hideAllNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
