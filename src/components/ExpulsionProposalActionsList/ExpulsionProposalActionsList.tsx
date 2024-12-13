import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { MutationError, idle, pending } from "@reactive-dot/core";
import { Button } from "flowbite-react";
import type { TxEvent } from "polkadot-api";

import { useNotifications } from "@/contexts/Notifications";
import type { NotificationKey, StatusNotification } from "@/contexts/Notifications/types";

import { comparators } from "@/utils/comparators";

import type { ExpulsionProposalActionsListProps, ExpulsionProposalActionsItemProps } from "./types";

import { useActiveAccount } from "@/contexts/ActiveAccount";

const ExpulsionProposalActionsList: React.FC<ExpulsionProposalActionsListProps> = ({ actions }) => {
  const [actionInProgress, setActionInProgress] = useState<boolean>(false);
  const enabledActions = useMemo(() => actions.filter((action) => action.enabled), [actions]);

  return (
    enabledActions.length > 0 && (
      <div className="my-8 flex justify-center gap-0 space-x-0 rounded-lg bg-sky-50 p-6 text-center dark:bg-gray-600 [&>button:first-child]:rounded-l-lg [&>button:last-child]:rounded-r-lg [&>button:only-of-type]:rounded-lg [&>button]:rounded-none">
        {enabledActions.map((action) => (
          <ExpulsionProposalActionItem
            key={action.label}
            {...action}
            actionInProgress={actionInProgress}
            setActionInProgress={setActionInProgress}
          />
        ))}
      </div>
    )
  );
};

const ExpulsionProposalActionItem: React.FC<ExpulsionProposalActionsItemProps> = ({
  actionInProgress,
  setActionInProgress,
  transaction,
  label,
  icon,
  enabled,
  notifications,
}) => {
  const { activeAccount } = useActiveAccount();
  const [state, submit] = transaction;
  const { showStatusNotification, updateStatusNotification } = useNotifications();
  const [notificationKey, setNotificationKey] = useState<NotificationKey | undefined>(undefined);
  const [localActionInProgress, setLocalActionInProgress] = useState<boolean>(false);
  const mutationStateRef = useRef<StatusNotification["status"]>(idle);

  const handleComplete = useCallback(() => {
    setActionInProgress(false);
    setLocalActionInProgress(false);
    setNotificationKey(undefined);
  }, [setActionInProgress]);

  useEffect(() => {
    if (localActionInProgress) {
      if (notificationKey && !comparators.mutationStateIsEqual(mutationStateRef.current, state)) {
        mutationStateRef.current = state;
        updateStatusNotification(notificationKey, state);
      }

      if (
        state !== pending &&
        state !== idle &&
        (state instanceof MutationError || (state as TxEvent).type === "finalized")
      ) {
        handleComplete();
      }
    }
  }, [state, localActionInProgress, notificationKey, updateStatusNotification, handleComplete]);

  const handleClick = () => {
    if (actionInProgress || !activeAccount) return;
    setActionInProgress(true);
    setLocalActionInProgress(true);
    submit({ signer: activeAccount.polkadotSigner });

    const $notificationKey = showStatusNotification({
      status: state,
      ...notifications,
    });
    setNotificationKey($notificationKey);
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={!enabled || actionInProgress || !activeAccount}
      color="gray"
      className="border-none bg-gray-300/50 dark:bg-gray-800/50"
      size="xl"
    >
      {icon}
      {label}
    </Button>
  );
};

export default ExpulsionProposalActionsList;
