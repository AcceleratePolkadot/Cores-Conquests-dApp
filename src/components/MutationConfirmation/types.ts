import type { StatusNotification } from "@/contexts/Notifications/types";
import type { OptionsObject } from "notistack";

export interface NotificationMessages {
  pending: {
    message: string;
    options: OptionsObject<"mutationPending">;
  };
  success: {
    message: string;
    options: OptionsObject<"mutationPending">;
  };
  failure: {
    message: string;
    options: OptionsObject<"mutationPending">;
  };
}

export interface MutationConfirmationProps {
  children: React.ReactNode;
  mutationState: StatusNotification["status"];
  submitMutation: () => void;
  notificationMessages: NotificationMessages;
  onComplete: () => void;
  setDismissible: (dismissible: boolean) => void;
  buttonText?: string;
}
