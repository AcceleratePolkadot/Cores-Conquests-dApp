import type React from "react";
import { useEffect, useState } from "react";

import { useLazyLoadQuery, useMutation } from "@reactive-dot/react";
import clsx from "clsx";
import { Button, Modal, Tooltip } from "flowbite-react";
import _ from "lodash";
import type { OptionsObject } from "notistack";
import { Binary } from "polkadot-api";
import { useForm } from "react-hook-form";

import { GiSkullCrossedBones } from "react-icons/gi";
import { PiTextAaFill } from "react-icons/pi";

import { useActiveAccount } from "@/contexts/ActiveAccount";
import { useExpulsionProposals } from "@/contexts/ExpulsionProposals";
import { useRosters } from "@/contexts/Rosters";

import type {
  CanAddExpulsionProposalResult,
  ExpulsionProposalAddButtonProps,
  ExpulsionProposalAddConfirmationProps,
  ExpulsionProposalAddFormProps,
  ExpulsionProposalAddModalProps,
  ExpulsionProposalAddProps,
} from "./types";

import MutationConfirmation from "@/components/MutationConfirmation/MutationConfirmation";

const ExpulsionProposalAdd: React.FC<ExpulsionProposalAddProps> = ({ subject }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [canAddExpulsionProposal, setCanAddExpulsionProposal] =
    useState<CanAddExpulsionProposalResult>({ can: false });
  const { activeRoster } = useRosters();
  const { activeAccount } = useActiveAccount();
  const { forRoster } = useExpulsionProposals();

  const [currentBlock, proposalsMax] = useLazyLoadQuery((builder) =>
    builder
      .readStorage("System", "Number", [])
      .getConstant("Roster", "ExpulsionProposalsPerRosterMax"),
  );

  const lockout = useLazyLoadQuery(
    !activeRoster || !activeRoster
      ? undefined
      : (builder) =>
          builder.readStorage("Roster", "ExpulsionProposalLockouts", [
            activeAccount?.address ?? "",
            activeRoster.id,
          ]),
  );

  useEffect(() => {
    const checkValidity = () => {
      if (!activeAccount || !activeRoster)
        return {
          can: false,
          reason: "No active Account or Roster",
        };

      if (subject === activeAccount.address)
        return {
          can: false,
          reason: "You cannot raise an expulsion proposal against yourself",
        };

      if (typeof lockout === "number" && lockout >= currentBlock) {
        return {
          can: false,
          reason: `Account locked out for ${lockout - currentBlock} more blocks`,
        };
      }

      const activeProposals = forRoster(activeRoster.id);

      if (
        activeProposals.some(
          (p) =>
            p.motioner === activeAccount.address && ["Proposed", "Voting"].includes(p.status.type),
        )
      ) {
        return {
          can: false,
          reason: "You have already raised an active expulsion proposal",
        };
      }

      if (
        activeProposals.some(
          (p) => p.subject === subject && ["Proposed", "Voting"].includes(p.status.type),
        )
      ) {
        return {
          can: false,
          reason: "The member already has an active expulsion proposal against them",
        };
      }

      // Check if roster has reached max proposals
      if (activeProposals.length >= proposalsMax) {
        return {
          can: false,
          reason: "Maximum number of active expulsion proposals reached",
        };
      }

      return { can: true };
    };
    setCanAddExpulsionProposal(checkValidity());
  }, [activeAccount, activeRoster, forRoster, currentBlock, lockout, proposalsMax, subject]);

  const handleOpenModal = () => {
    if (!canAddExpulsionProposal.can) return;
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <ExpulsionProposalAddButton
        onClick={handleOpenModal}
        disabled={!canAddExpulsionProposal.can}
        tooltipContent={canAddExpulsionProposal.reason}
      />
      <ExpulsionProposalAddModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        subject={subject}
      />
    </div>
  );
};

const ExpulsionProposalAddButton: React.FC<ExpulsionProposalAddButtonProps> = ({
  onClick,
  disabled,
  tooltipContent,
}) => {
  return (
    <Tooltip content={tooltipContent ?? "Add Expulsion Proposal"}>
      <Button color="failure" pill size="xs" disabled={disabled} onClick={onClick}>
        <GiSkullCrossedBones />
      </Button>
    </Tooltip>
  );
};

const ExpulsionProposalAddModal: React.FC<ExpulsionProposalAddModalProps> = ({
  isOpen,
  onClose,
  subject,
}) => {
  const { activeRoster } = useRosters();
  const { activeAccount } = useActiveAccount();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [reason, setReason] = useState<string>("");
  const [dismissible, setDismissible] = useState<boolean>(true);

  const [minLength, maxLength] = useLazyLoadQuery((builder) =>
    builder
      .getConstant("Roster", "ExpulsionReasonMinLength")
      .getConstant("Roster", "ExpulsionReasonMaxLength"),
  );

  const txReady =
    activeAccount && activeRoster && reason.length >= minLength && reason.length <= maxLength;

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
        Add Expulsion Proposal
      </Modal.Header>
      <Modal.Body>
        {submitting && txReady ? (
          <ExpulsionProposalAddConfirmation
            reason={reason}
            subject={subject}
            rosterId={activeRoster.id}
            activeAccount={activeAccount}
            onComplete={handleClose}
            setDismissible={setDismissible}
          />
        ) : (
          <ExpulsionProposalAddForm
            setReason={setReason}
            onFormSubmit={onFormSubmit}
            minLength={minLength}
            maxLength={maxLength}
          />
        )}
      </Modal.Body>
    </Modal>
  );
};

const ExpulsionProposalAddForm: React.FC<ExpulsionProposalAddFormProps> = ({
  setReason,
  onFormSubmit,
  minLength,
  maxLength,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<{ reason: string }>();

  const reasonInputValue = watch("reason");
  const characterCount = reasonInputValue?.length || 0;

  useEffect(() => {
    setReason(reasonInputValue || "");
  }, [reasonInputValue, setReason]);

  const onSubmit = (data: { reason: string }) => {
    reset();
    onFormSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4 min-h-24 space-y-2">
        <label
          htmlFor="reason"
          className="block font-medium text-gray-700 text-sm dark:text-gray-300"
        >
          Reason for Expulsion
        </label>
        <textarea
          id="reason"
          rows={4}
          {...register("reason", {
            required: "Reason is required",
            minLength: {
              value: minLength,
              message: `Reason must be at least ${minLength} characters`,
            },
            maxLength: {
              value: maxLength,
              message: `Reason must not exceed ${maxLength} characters`,
            },
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        <div
          className={clsx("flex items-center gap-1 text-sm", {
            "text-red-500": characterCount < minLength || characterCount > maxLength,
            "text-amber-500": characterCount >= maxLength * 0.9,
            "text-green-500": characterCount >= minLength && characterCount <= maxLength,
          })}
        >
          <PiTextAaFill />
          {characterCount} of
          {characterCount < minLength ? ` ${minLength} minimum` : ` ${maxLength} maximum`}
        </div>
        {errors.reason && <p className="mt-2 text-red-600 text-sm">{errors.reason.message}</p>}
      </div>
      <div className="flex justify-end">
        <Button type="submit" color="failure">
          Add Expulsion Proposal
        </Button>
      </div>
    </form>
  );
};

const ExpulsionProposalAddConfirmation: React.FC<ExpulsionProposalAddConfirmationProps> = ({
  reason,
  subject,
  rosterId,
  activeAccount,
  onComplete,
  setDismissible,
}) => {
  const [proposalState, submitProposal] = useMutation(
    (tx) =>
      tx.Roster.expulsion_proposal_new({
        subject,
        roster_id: rosterId,
        reason: Binary.fromText(reason),
      }),
    { signer: activeAccount.polkadotSigner },
  );

  const options = {
    additional: [
      {
        label: "Expulsion Proposal",
        rows: [
          {
            label: "Roster ID",
            value: rosterId.asHex(),
          },
          {
            label: "Motioner",
            value: activeAccount.address,
          },
          {
            label: "Subject",
            value: subject,
          },
          {
            label: "Reason",
            value: _.truncate(reason, { length: 20, separator: /[!-\/:-@[-`{-~]? +/ }),
          },
        ],
      },
    ],
  } as OptionsObject<"mutationPending">;

  const notificationMessages = {
    pending: {
      message: "Submitting Expulsion Proposal",
      options,
    },
    success: {
      message: "Expulsion Proposal submitted!",
      options,
    },
    failure: {
      message: "Expulsion Proposal submission failed!",
      options,
    },
  };

  return (
    <MutationConfirmation
      mutationState={proposalState}
      submitMutation={submitProposal}
      notificationMessages={notificationMessages}
      onComplete={onComplete}
      setDismissible={setDismissible}
    >
      <h2 className="block font-medium text-gray-700 text-sm dark:text-gray-300">
        Raise Expulsion Proposal against {subject}?
      </h2>
    </MutationConfirmation>
  );
};

export default ExpulsionProposalAdd;
