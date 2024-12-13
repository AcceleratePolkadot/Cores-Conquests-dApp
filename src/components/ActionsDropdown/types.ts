import type { StatusNotification } from "@/contexts/Notifications/types";
import type { useMutation } from "@reactive-dot/react";

export type Action = {
  transaction: ReturnType<typeof useMutation>;
  label: string;
  icon?: React.FC<React.ComponentProps<"svg">>;
  enabled: boolean;
  notifications: Omit<StatusNotification, "status">;
};

export interface ActionsDropdownProps {
  actions: Action[];
}

export interface ActionsDropdownItemProps extends Action {
  actionInProgress: boolean;
  setActionInProgress: (value: boolean) => void;
}
