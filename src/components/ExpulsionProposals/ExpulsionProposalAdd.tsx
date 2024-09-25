import { useAccounts } from "@/contexts/Accounts";
import type { AccountId } from "@/contexts/Accounts/types";
import { useBlocApiClient } from "@/contexts/BlocApiClient";
import { useExpulsionProposals } from "@/contexts/ExpulsionProposals";
import { usePalletsConstants } from "@/contexts/PalletsConstants";
import { useRosters } from "@/contexts/Rosters";
import { formatNumber } from "@/helpers/format";
import useBalanceFormatter from "@/hooks/useBalanceFormatter";
import { BigNumber } from "bignumber.js";
import { Button, Modal, Tooltip } from "flowbite-react";
import { Binary } from "polkadot-api";
import type React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaTrashCan } from "react-icons/fa6";

interface ExpulsionProposalAddProps {
  subject: AccountId;
}

const ExpulsionProposalAdd: React.FC<ExpulsionProposalAddProps> = ({ subject }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { activeRoster } = useRosters();
  const { activeAccount } = useAccounts();
  const { byMotioner } = useExpulsionProposals();
  const { constants } = usePalletsConstants();
  const rosterConstants = constants("Roster");

  const canAddExpulsionProposal = () => {
    // There can be other reasons they might not be able to add an expulsion proposal, like if they
    // had a previous expulsion proposal dismissed with prejudice. We're just checking the basics
    // the chain will enforce the rest
    return !(
      !activeAccount ||
      !activeRoster ||
      byMotioner(activeAccount.address).some(
        (proposal) => proposal.roster.asHex() === activeRoster.id.asHex(),
      ) ||
      ("ExpulsionProposalsPerRosterMax" in rosterConstants &&
        rosterConstants.ExpulsionProposalsPerRosterMax &&
        activeRoster.expulsion_proposals.length >= rosterConstants.ExpulsionProposalsPerRosterMax)
    );
  };

  const handleOpenModal = () => {
    if (!canAddExpulsionProposal()) return;
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <ExpulsionProposalAddButton onClick={handleOpenModal} disabled={!canAddExpulsionProposal()} />
      <ExpulsionProposalAddModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        subject={subject}
      />
    </div>
  );
};

interface ExpulsionProposalAddButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const ExpulsionProposalAddButton: React.FC<ExpulsionProposalAddButtonProps> = ({
  onClick,
  disabled,
}) => {
  return (
    <Tooltip
      content={disabled ? "Cannot Add Expulsion Proposal" : "Add Expulsion Proposal"}
      placement="right"
    >
      <Button gradientMonochrome="failure" size="xs" disabled={disabled} onClick={onClick}>
        <FaTrashCan />
      </Button>
    </Tooltip>
  );
};

interface ExpulsionProposalAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: AccountId;
}

const ExpulsionProposalAddModal: React.FC<ExpulsionProposalAddModalProps> = ({
  isOpen,
  onClose,
  subject,
}) => {
  const { activeRoster } = useRosters();
  const { activeAccount } = useAccounts();
  const { blocApi } = useBlocApiClient();
  const { constants } = usePalletsConstants();
  const rosterConstants = constants("Roster");
  const { balanceFormatter } = useBalanceFormatter();
  const [newExpulsionProposalDeposit, setNewExpulsionProposalDeposit] = useState<
    BigNumber | undefined
  >(undefined);
  const [estimatedFee, setEstimatedFee] = useState<BigNumber | undefined>(undefined);
  const [estimatedTotal, setEstimatedTotal] = useState<BigNumber | undefined>(undefined);
  const [reasonLength, setReasonLength] = useState<{ min: number; max: number }>({
    min: 0,
    max: Number.POSITIVE_INFINITY,
  });
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<{ reason: string }>();

  const reason = watch("reason");
  const [characterCount, setCharacterCount] = useState(0);

  useEffect(() => {
    if (
      "NewExpulsionProposalDeposit" in rosterConstants &&
      rosterConstants.NewExpulsionProposalDeposit
    ) {
      setNewExpulsionProposalDeposit(
        BigNumber(rosterConstants.NewExpulsionProposalDeposit.toString()),
      );
    }
  }, [rosterConstants]);

  useEffect(() => {
    const max =
      "ExpulsionReasonMaxLength" in rosterConstants
        ? Number(rosterConstants.ExpulsionReasonMaxLength)
        : Number.POSITIVE_INFINITY;
    const min =
      "ExpulsionReasonMinLength" in rosterConstants
        ? Number(rosterConstants.ExpulsionReasonMinLength)
        : 0;
    setReasonLength({ min, max });
  }, [rosterConstants]);

  useEffect(() => {
    if (activeAccount && activeRoster && reason) {
      (async () => {
        const fee = await blocApi.tx.Roster.expulsion_proposal_new({
          subject,
          reason: Binary.fromText(reason),
          roster_id: activeRoster.id,
        }).getEstimatedFees(activeAccount.address);
        setEstimatedFee(BigNumber(fee.toString()));
      })();
    } else {
      setEstimatedFee(undefined);
    }
  }, [activeAccount, activeRoster, reason, blocApi.tx.Roster.expulsion_proposal_new, subject]);

  useEffect(() => {
    if (newExpulsionProposalDeposit && estimatedFee) {
      setEstimatedTotal(newExpulsionProposalDeposit.plus(estimatedFee));
    } else {
      setEstimatedTotal(undefined);
    }
  }, [newExpulsionProposalDeposit, estimatedFee]);

  useEffect(() => {
    setCharacterCount(reason ? reason.length : 0);
  }, [reason]);

  const onSubmit = (data: { reason: string }) => {
    console.log(data.reason);
    handleClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal show={isOpen} onClose={handleClose} dismissible>
      <Modal.Header>Add Expulsion Proposal</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4 min-h-56 space-y-2">
            <label
              htmlFor="reason"
              className="block font-medium text-gray-700 text-sm dark:text-gray-300"
            >
              Reason for Expulsion
            </label>
            <textarea
              id="reason"
              {...register("reason", {
                required: "Reason is required",
                minLength: {
                  value: reasonLength.min,
                  message: `Reason must be at least ${formatNumber(reasonLength.min)} characters`,
                },
                maxLength: {
                  value: reasonLength.max,
                  message: `Reason must not exceed ${formatNumber(reasonLength.max)} characters`,
                },
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              rows={5}
            />
            <p
              className={`text-sm ${characterCount < reasonLength.min || characterCount > reasonLength.max ? "text-red-600" : "text-gray-500"}`}
            >
              Character count: {formatNumber(characterCount)}
            </p>
            {errors.reason && <p className="mt-2 text-red-600 text-sm">{errors.reason.message}</p>}
            <div className="absolute bottom-6 left-0 pl-6">
              <ul className="font-mono text-gray-700 text-xxs dark:text-gray-300">
                <li>
                  <span className="inline-block w-16">Deposit:</span>{" "}
                  {newExpulsionProposalDeposit
                    ? balanceFormatter(newExpulsionProposalDeposit)
                    : "?"}
                </li>
                <li>
                  <span className="inline-block w-16">Est Fee:</span>{" "}
                  {estimatedFee ? balanceFormatter(estimatedFee) : "?"}
                </li>
                <li className="font-bold">
                  <span className="inline-block w-16">Est Total:</span>{" "}
                  {estimatedTotal ? balanceFormatter(estimatedTotal) : "?"}
                </li>
              </ul>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" gradientDuoTone="pinkToOrange">
              Submit
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ExpulsionProposalAdd;
