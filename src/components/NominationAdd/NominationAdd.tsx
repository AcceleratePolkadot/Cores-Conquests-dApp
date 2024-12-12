import type React from "react";
import { useEffect, useState } from "react";

import { useLazyLoadQuery, useMutation } from "@reactive-dot/react";
import { Polkicon } from "@w3ux/react-polkicon";
import { isValidAddress } from "@w3ux/utils";
import { Button, Modal, Tooltip } from "flowbite-react";
import _ from "lodash";
import type { OptionsObject } from "notistack";
import { useForm } from "react-hook-form";

import { FaCirclePlus, FaPersonWalkingArrowRight } from "react-icons/fa6";

import Rosticon from "@/components/Rosticon";
import TruncatedHash from "@/components/TruncatedHash";
import { useActiveAccount } from "@/contexts/ActiveAccount";
import { useRosters } from "@/contexts/Rosters";

import type {
  NominationAddButtonProps,
  NominationAddConfirmationProps,
  NominationAddFormProps,
  NominationAddModalProps,
} from "./types";

import MutationConfirmation from "@/components/MutationConfirmation";

const NominationAdd: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { activeRoster } = useRosters();
  const { activeAccount } = useActiveAccount();
  const membersMax = useLazyLoadQuery((builder) => builder.getConstant("Roster", "MembersMax"));

  const canAddNomination = () => {
    return !(
      !activeAccount ||
      !activeRoster ||
      activeRoster.members.length >= membersMax ||
      !activeRoster.members.includes(activeAccount.address)
    );
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
    <Tooltip content={disabled ? "Can't add nomination" : "Add Nomination"} placement="right">
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
            roster={activeRoster}
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
  roster,
  activeAccount,
  onComplete,
  setDismissible,
}) => {
  const [nominationState, submitNomination] = useMutation(
    (tx) => tx.Roster.nomination_new({ nominee, roster_id: roster.id }),
    { signer: activeAccount.polkadotSigner },
  );

  const options = {
    additional: [
      {
        label: "Nomination",
        rows: [
          {
            label: "Roster ID",
            value: roster.id.asHex(),
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

  const notificationMessages = {
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
  };

  return (
    <MutationConfirmation
      mutationState={nominationState}
      submitMutation={submitNomination}
      notificationMessages={notificationMessages}
      onComplete={onComplete}
      setDismissible={setDismissible}
      button={{
        color: "success",
        label: "Confirm Nomination?",
      }}
    >
      <h2 className="block text-center font-normal text-base text-gray-600 dark:text-gray-400">
        Are you sure you want to nominate{" "}
        <TruncatedHash
          hash={nominee}
          copy={false}
          className="font-semibold text-gray-900 dark:text-white"
        />{" "}
        to{" "}
        <span className="font-semibold text-gray-900 dark:text-white">{roster.title.asText()}</span>
        ?
      </h2>
      <div className="flex items-center justify-center space-x-4 py-6 text-[100px]">
        <Polkicon address={nominee} background="none" />
        <FaPersonWalkingArrowRight className="animate-pulse text-gray-600 dark:text-gray-400" />
        <Rosticon rosterId={roster.id} className="h-24 w-24" />
      </div>
    </MutationConfirmation>
  );
};

export default NominationAdd;
