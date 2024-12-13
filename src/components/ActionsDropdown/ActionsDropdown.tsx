import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { MutationError, idle, pending } from "@reactive-dot/core";
import { Dropdown } from "flowbite-react";
import type { TxEvent } from "polkadot-api";

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaEllipsisVertical } from "react-icons/fa6";

import { useNotifications } from "@/contexts/Notifications";
import type { NotificationKey, StatusNotification } from "@/contexts/Notifications/types";

import { comparators } from "@/utils/comparators";

import type { ActionsDropdownProps, ActionsDropdownItemProps } from "./types";

import { useActiveAccount } from "@/contexts/ActiveAccount";
import clsx from "clsx";

const ActionsDropdown: React.FC<ActionsDropdownProps> = ({ actions }) => {
  const [actionInProgress, setActionInProgress] = useState<boolean>(false);

  return (
    actions.length > 0 && (
      <Dropdown
        label={
          actionInProgress ? (
            <AiOutlineLoading3Quarters className="animate-spin" />
          ) : (
            <FaEllipsisVertical />
          )
        }
        dismissOnClick={true}
        inline
        arrowIcon={false}
      >
        {actions.map((action) => (
          <ActionsDropdownItem
            key={action.label}
            {...action}
            actionInProgress={actionInProgress}
            setActionInProgress={setActionInProgress}
          />
        ))}
      </Dropdown>
    )
  );
};

const ActionsDropdownItem: React.FC<ActionsDropdownItemProps> = ({
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
    <Dropdown.Item
      onClick={handleClick}
      icon={icon}
      disabled={!enabled || actionInProgress || !activeAccount}
      className={clsx({ hidden: !enabled })}
    >
      {label}
    </Dropdown.Item>
  );
};

export default ActionsDropdown;
