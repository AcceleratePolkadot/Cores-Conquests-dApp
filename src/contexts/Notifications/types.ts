import type { OptionsObject, SnackbarKey, SnackbarMessage } from "notistack";

export interface ShowNotificationInterface {
  message: SnackbarMessage;
  options: OptionsObject;
}

export interface NotificationsContextType {
  showNotification: (notification: ShowNotificationInterface) => SnackbarKey;
  hideNotification: (key: SnackbarKey) => void;
  hideAllNotifications: () => void;
}
