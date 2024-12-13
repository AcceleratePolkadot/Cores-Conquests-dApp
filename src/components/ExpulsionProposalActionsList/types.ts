import type { StatusNotification } from "@/contexts/Notifications/types";
import type { useMutation } from "@reactive-dot/react";

export type Action = {
  transaction: ReturnType<typeof useMutation>;
  label: string;
  icon?: React.ReactNode;
  enabled: boolean;
  notifications: Omit<StatusNotification, "status">;
};

export interface ExpulsionProposalActionsListProps {
  actions: Action[];
}

export interface ExpulsionProposalActionsItemProps extends Action {
  actionInProgress: boolean;
  setActionInProgress: (value: boolean) => void;
}
