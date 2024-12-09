import type React from "react";
import { useEffect, useRef, useState } from "react";

import { MutationError, idle, pending } from "@reactive-dot/core";
import { useMutation } from "@reactive-dot/react";
import { Button, Modal, Tooltip } from "flowbite-react";
import type { OptionsObject } from "notistack";
import type { TxEvent } from "polkadot-api";
import { Binary } from "polkadot-api";
import { useForm } from "react-hook-form";

import { FaCirclePlus } from "react-icons/fa6";

import { useActiveAccount } from "@/contexts/ActiveAccount";
import { useNotifications } from "@/contexts/Notifications";
import type { NotificationKey, StatusNotification } from "@/contexts/Notifications/types";

import type {
  RosterAddButtonProps,
  RosterAddConfirmationProps,
  RosterAddFormProps,
  RosterAddModalProps,
} from "./types";

const RosterAdd: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { activeAccount } = useActiveAccount();

  const handleOpenModal = () => {
    if (!activeAccount) return;
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <RosterAddButton onClick={handleOpenModal} disabled={!activeAccount} />
      <RosterAddModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

const RosterAddButton: React.FC<RosterAddButtonProps> = ({ onClick, disabled }) => {
  return (
    <Tooltip content={disabled ? "Connect Account" : "Add new roster"} placement="right">
      <Button gradientDuoTone="purpleToPink" disabled={disabled} onClick={onClick}>
        <FaCirclePlus className="mt-0.5 mr-2" /> Add New Roster
      </Button>
    </Tooltip>
  );
};

const RosterAddModal: React.FC<RosterAddModalProps> = ({ isOpen, onClose }) => {
  const { activeAccount } = useActiveAccount();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [dismissible, setDismissible] = useState<boolean>(true);

  const txReady = activeAccount && title && title.length > 0;

  const onFormSubmit = () => {
    if (!submitting && txReady) {
      setSubmitting(true);
    }
  };

  const handleClose = () => {
    setSubmitting(false);
    setDismissible(true);
    onClose();
  };

  return (
    <Modal show={isOpen} onClose={handleClose} dismissible={dismissible}>
      <Modal.Header className={!dismissible ? "[&>button]:hidden" : undefined}>
        Create New Roster
      </Modal.Header>
      <Modal.Body>
        {submitting && txReady ? (
          <RosterAddConfirmation
            title={title}
            activeAccount={activeAccount}
            onComplete={handleClose}
            setDismissible={setDismissible}
          />
        ) : (
          <RosterAddForm setTitle={setTitle} onFormSubmit={onFormSubmit} />
        )}
      </Modal.Body>
    </Modal>
  );
};

const RosterAddForm: React.FC<RosterAddFormProps> = ({ setTitle, onFormSubmit }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<{ title: string }>();

  const titleInputValue = watch("title");

  useEffect(() => {
    setTitle(titleInputValue);
  }, [titleInputValue, setTitle]);

  const onSubmit = (data: { title: string }) => {
    reset();
    onFormSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4 min-h-24 space-y-2">
        <label
          htmlFor="title"
          className="block font-medium text-gray-700 text-sm dark:text-gray-300"
        >
          Roster Title
        </label>
        <input
          id="title"
          type="text"
          {...register("title", {
            required: "Title is required",
            minLength: { value: 3, message: "Title must be at least 3 characters" },
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.title && <p className="mt-2 text-red-600 text-sm">{errors.title.message}</p>}
      </div>
      <div className="flex justify-end">
        <Button type="submit" gradientDuoTone="purpleToPink">
          Create Roster
        </Button>
      </div>
    </form>
  );
};

const RosterAddConfirmation: React.FC<RosterAddConfirmationProps> = ({
  title,
  activeAccount,
  onComplete,
  setDismissible,
}) => {
  const { showStatusNotification, updateStatusNotification } = useNotifications();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [rosterStatusKey, setRosterStatusKey] = useState<NotificationKey | undefined>(undefined);
  const [rosterState, submitRoster] = useMutation(
    (tx) => tx.Roster.roster_new({ title: Binary.fromText(title) }),
    {
      signer: activeAccount.polkadotSigner,
    },
  );

  const mutationState = useRef<StatusNotification["status"]>(idle);

  const options = {
    additional: [
      {
        label: "Roster",
        rows: [
          {
            label: "Title",
            value: title,
          },
          {
            label: "Founder",
            value: activeAccount.address,
          },
        ],
      },
    ],
  } as OptionsObject<"mutationPending">;

  useEffect(() => {
    const statusIsEqual = (a: StatusNotification["status"], b: StatusNotification["status"]) => {
      if (a === b) return true;
      if (a instanceof MutationError && b instanceof MutationError) return true;
      if (
        (a as TxEvent).type !== undefined &&
        (b as TxEvent).type !== undefined &&
        (a as TxEvent).type === (b as TxEvent).type
      )
        return true;
      return false;
    };

    if (submitting) {
      if (rosterStatusKey && !statusIsEqual(mutationState.current, rosterState)) {
        mutationState.current = rosterState;
        updateStatusNotification(rosterStatusKey, rosterState);
      }
      if (
        rosterState !== pending &&
        rosterState !== idle &&
        (rosterState instanceof MutationError || (rosterState as TxEvent).type === "finalized")
      ) {
        setSubmitting(false);
        setRosterStatusKey(undefined);
        onComplete();
      }
    }
  }, [rosterState, submitting, rosterStatusKey, updateStatusNotification, onComplete]);

  useEffect(() => {
    setDismissible(!submitting);
  }, [submitting, setDismissible]);

  const handleSubmitRoster = () => {
    setSubmitting(true);
    submitRoster();

    const statusKey = showStatusNotification({
      status: rosterState,
      pending: {
        message: "Creating Roster",
        options,
      },
      success: {
        message: "Roster created!",
        options,
      },
      failure: {
        message: "Roster creation failed!",
        options,
      },
    });
    setRosterStatusKey(statusKey);
  };

  return (
    <>
      <div className="mb-4 min-h-24 space-y-2">
        <h2 className="block font-medium text-gray-700 text-sm dark:text-gray-300">
          Create roster "{title}"?
        </h2>
      </div>
      <div className="flex justify-end">
        <Button
          type="button"
          gradientDuoTone="purpleToPink"
          onClick={() => handleSubmitRoster()}
          disabled={submitting}
        >
          Confirm
        </Button>
      </div>
    </>
  );
};

export default RosterAdd;
