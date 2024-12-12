import { MutationError, idle, pending } from "@reactive-dot/core";
import { Button } from "flowbite-react";
import type { TxEvent } from "polkadot-api";
import type React from "react";
import { useEffect, useRef, useState } from "react";

import { useNotifications } from "@/contexts/Notifications";
import type { NotificationKey, StatusNotification } from "@/contexts/Notifications/types";
import { comparators } from "@/utils/comparators";

import type { MutationConfirmationProps } from "./types";

const MutationConfirmation: React.FC<MutationConfirmationProps> = ({
  children,
  mutationState,
  submitMutation,
  notificationMessages,
  onComplete,
  setDismissible,
  buttonText = "Confirm",
}) => {
  const { showStatusNotification, updateStatusNotification } = useNotifications();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [statusKey, setStatusKey] = useState<NotificationKey | undefined>(undefined);
  const mutationStateRef = useRef<StatusNotification["status"]>(idle);

  useEffect(() => {
    if (submitting) {
      if (statusKey && !comparators.mutationStateIsEqual(mutationStateRef.current, mutationState)) {
        mutationStateRef.current = mutationState;
        updateStatusNotification(statusKey, mutationState);
      }

      if (
        mutationState !== pending &&
        mutationState !== idle &&
        (mutationState instanceof MutationError || (mutationState as TxEvent).type === "finalized")
      ) {
        setSubmitting(false);
        setStatusKey(undefined);
        onComplete();
      }
    }
  }, [mutationState, submitting, statusKey, updateStatusNotification, onComplete]);

  useEffect(() => {
    setDismissible(!submitting);
  }, [submitting, setDismissible]);

  const handleSubmit = () => {
    setSubmitting(true);
    submitMutation();

    const key = showStatusNotification({
      status: mutationState,
      ...notificationMessages,
    });
    setStatusKey(key);
  };

  return (
    <>
      <div className="mb-4 min-h-24 space-y-2">{children}</div>
      <div className="flex justify-end">
        <Button
          type="button"
          gradientDuoTone="cyanToBlue"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {buttonText}
        </Button>
      </div>
    </>
  );
};

export default MutationConfirmation;
