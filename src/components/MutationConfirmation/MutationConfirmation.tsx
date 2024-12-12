import { MutationError, idle, pending } from "@reactive-dot/core";
import { Button, Spinner } from "flowbite-react";
import type { TxEvent } from "polkadot-api";
import type React from "react";
import { useEffect, useRef, useState } from "react";

import { useNotifications } from "@/contexts/Notifications";
import type { NotificationKey, StatusNotification } from "@/contexts/Notifications/types";
import { comparators } from "@/utils/comparators";

import { buttonTheme, spinnerTheme } from "./theme";
import type { MutationConfirmationProps } from "./types";

const MutationConfirmation: React.FC<MutationConfirmationProps> = ({
  children,
  mutationState,
  submitMutation,
  notificationMessages,
  onComplete,
  setDismissible,
  button,
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

  const buttonDefaults = {
    size: "xl",
    color: "success",
    label: "Confirm",
    isProcessing: submitting,
    processingLabel: "Submitting Transaction…",
    processingSpinner: (
      <Spinner
        theme={spinnerTheme}
        size={button?.size ?? "xl"}
        color={button?.color ?? "success"}
      />
    ),
    disabled: submitting,
    theme: buttonTheme,
    onClick: handleSubmit,
  };

  return (
    <>
      <div className="mb-4 min-h-24 space-y-2">{children}</div>
      <div className="flex justify-center">
        <Button type="button" {...buttonDefaults} {...button} />
      </div>
    </>
  );
};

export default MutationConfirmation;
