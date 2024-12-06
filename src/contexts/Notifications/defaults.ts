import type { OptionsObject } from "notistack";
import type { NotificationsContextType } from "./types";

export const defaultNotificationsContext: NotificationsContextType = {
  showNotification: () => "",
  showStatusNotification: () => "",
  updateStatusNotification: () => {},
};

export const defaultOptions = {
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "right",
  },
  preventDuplicate: true,
  autoHideDuration: 10000,
  maxSnack: 10,
} as OptionsObject;
