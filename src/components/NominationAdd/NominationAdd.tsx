import type React from "react";
import { useEffect, useRef, useState } from "react";

import { MutationError, idle, pending } from "@reactive-dot/core";
import { useLazyLoadQuery, useMutation } from "@reactive-dot/react";
import { isValidAddress } from "@w3ux/utils";
import { Button, Modal, Tooltip } from "flowbite-react";
import _ from "lodash";
import type { OptionsObject } from "notistack";
import type { TxEvent } from "polkadot-api";
import { useForm } from "react-hook-form";

import { FaCirclePlus } from "react-icons/fa6";

import { useActiveAccount } from "@/contexts/ActiveAccount";
import { useNotifications } from "@/contexts/Notifications";
import type { NotificationKey, StatusNotification } from "@/contexts/Notifications/types";
import { useRosters } from "@/contexts/Rosters";

import { comparators } from "@/utils/comparators";

import type {
  NominationAddButtonProps,
  NominationAddConfirmationProps,
  NominationAddFormProps,
  NominationAddModalProps,
} from "./types";

const NominationAdd: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { activeRoster } = useRosters();
  const { activeAccount } = useActiveAccount();
  const membersMax = useLazyLoadQuery((builder) => builder.getConstant("Roster", "MembersMax"));

  const canAddNomination = () => {
    return !(!activeAccount || !activeRoster || activeRoster.members.length >= membersMax);
  };

  const handleOpenModal = () => {
    if (!canAddNomination()) return;
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <NominationAddButton onClick={handleOpenModal} disabled={!canAddNomination()} />
      <NominationAddModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

const NominationAddButton: React.FC<NominationAddButtonProps> = ({ onClick, disabled }) => {
  return (
    <Tooltip content={disabled ? "Roster Full" : "Add Nomination"} placement="right">
      <Button gradientDuoTone="pinkToOrange" size="xs" disabled={disabled} onClick={onClick}>
        <FaCirclePlus />
      </Button>
    </Tooltip>
  );
};

const NominationAddModal: React.FC<NominationAddModalProps> = ({ isOpen, onClose }) => {
  const { activeRoster } = useRosters();
  const { activeAccount } = useActiveAccount();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [nominee, setNominee] = useState<string>("");
  const [dismissible, setDismissible] = useState<boolean>(true);

  const txReady = activeAccount && activeRoster && isValidAddress(nominee);

  const onFormSubmit = () => {
    if (!submitting && txReady) {
      setSubmitting(true);
    }
  };

  const handleClose = () => {
    setSubmitting(false);
    onClose();
  };

  return (
    <Modal show={isOpen} onClose={handleClose} dismissible={dismissible}>
      <Modal.Header className={!dismissible ? "[&>button]:hidden" : undefined}>
        Add Nomination
      </Modal.Header>
      <Modal.Body>
        {submitting && txReady ? (
          <NominationAddConfirmation
            nominee={nominee}
            rosterId={activeRoster.id}
            activeAccount={activeAccount}
            onComplete={handleClose}
            setDismissible={setDismissible}
          />
        ) : (
          <NominationAddForm setNominee={setNominee} onFormSubmit={onFormSubmit} />
        )}
      </Modal.Body>
    </Modal>
  );
};

const NominationAddForm: React.FC<NominationAddFormProps> = ({ setNominee, onFormSubmit }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<{ nominee: string }>();

  const nomineeInputValue = watch("nominee");

  useEffect(() => {
    setNominee(nomineeInputValue);
  }, [nomineeInputValue, setNominee]);

  const onSubmit = (data: { nominee: string }) => {
    reset();
    onFormSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4 min-h-24 space-y-2">
        <label
          htmlFor="nominee"
          className="block font-medium text-gray-700 text-sm dark:text-gray-300"
        >
          Nominee's Account ID
        </label>
        <input
          id="nominee"
          type="text"
          {...register("nominee", {
            required: "Account ID is required",
            validate: (value) => isValidAddress(value) || "Invalid Account ID",
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.nominee && <p className="mt-2 text-red-600 text-sm">{errors.nominee.message}</p>}
      </div>
      <div className="flex justify-end">
        <Button type="submit" gradientDuoTone="cyanToBlue">
          Add Nomination
        </Button>
      </div>
    </form>
  );
};

const NominationAddConfirmation: React.FC<NominationAddConfirmationProps> = ({
  nominee,
  rosterId,
  activeAccount,
  onComplete,
  setDismissible,
}) => {
  const { showStatusNotification, updateStatusNotification } = useNotifications();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [nominationStatusKey, setNominationStatusKey] = useState<NotificationKey | undefined>(
    undefined,
  );
  const [nominationState, submitNomination] = useMutation(
    (tx) => tx.Roster.nomination_new({ nominee, roster_id: rosterId }),
    { signer: activeAccount.polkadotSigner },
  );

  const mutationState = useRef<StatusNotification["status"]>(idle);

  const options = {
    additional: [
      {
        label: "Nomination",
        rows: [
          {
            label: "Roster ID",
            value: rosterId.asHex(),
          },
          {
            label: "Nominator",
            value: activeAccount.address,
          },
          {
            label: "Nominee",
            value: nominee,
          },
        ],
      },
    ],
  } as OptionsObject<"mutationPending">;

  useEffect(() => {
    if (submitting) {
      if (
        nominationStatusKey &&
        !comparators.mutationStateIsEqual(mutationState.current, nominationState)
      ) {
        mutationState.current = nominationState;
        updateStatusNotification(nominationStatusKey, nominationState);
      }

      if (
        nominationState !== pending &&
        nominationState !== idle &&
        (nominationState instanceof MutationError ||
          (nominationState as TxEvent).type === "finalized")
      ) {
        setSubmitting(false);
        setNominationStatusKey(undefined);
        onComplete();
      }
    }
  }, [nominationState, submitting, nominationStatusKey, updateStatusNotification, onComplete]);

  useEffect(() => {
    setDismissible(!submitting);
  }, [submitting, setDismissible]);

  const handleSubmitNomination = () => {
    setSubmitting(true);
    submitNomination();

    const statusKey = showStatusNotification({
      status: nominationState,
      pending: {
        message: "Submitting Nomination",
        options,
      },
      success: {
        message: "Nomination submitted!",
        options,
      },
      failure: {
        message: "Nomination submission failed!",
        options,
      },
    });
    setNominationStatusKey(statusKey);
  };

  return (
    <>
      <div className="mb-4 min-h-24 space-y-2">
        <h2 className="block font-medium text-gray-700 text-sm dark:text-gray-300">
          Nominate {nominee}?
        </h2>
      </div>
      <div className="flex justify-end">
        <Button
          type="button"
          gradientDuoTone="cyanToBlue"
          onClick={() => handleSubmitNomination()}
          disabled={submitting}
        >
          Confirm
        </Button>
      </div>
    </>
  );
};

export default NominationAdd;
