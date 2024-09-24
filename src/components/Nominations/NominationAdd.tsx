import { isValidAddress } from "@w3ux/utils";
import { BigNumber } from "bignumber.js";
import { Button, Modal, Tooltip } from "flowbite-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaCirclePlus } from "react-icons/fa6";

import { useAccounts } from "@/contexts/Accounts";
import { useBlocApiClient } from "@/contexts/BlocApiClient";
import { usePalletsConstants } from "@/contexts/PalletsConstants";
import { useRosters } from "@/contexts/Rosters";
import useBalanceFormatter from "@/hooks/useBalanceFormatter";

const NominationAdd: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { activeRoster } = useRosters();
  const { activeAccount } = useAccounts();
  const { constants } = usePalletsConstants();
  const rosterConstants = constants("Roster");

  const canAddNomination = () => {
    return !(
      !activeAccount ||
      !activeRoster ||
      ("MembersMax" in rosterConstants &&
        rosterConstants.MembersMax &&
        activeRoster.members.length >= rosterConstants.MembersMax)
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

interface NominationAddButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const NominationAddButton: React.FC<NominationAddButtonProps> = ({ onClick, disabled }) => {
  return (
    <Tooltip content={disabled ? "Roster Full" : "Add Nomination"} placement="right">
      <Button gradientDuoTone="pinkToOrange" size="xs" disabled={disabled} onClick={onClick}>
        <FaCirclePlus />
      </Button>
    </Tooltip>
  );
};

interface NominationAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NominationAddModal: React.FC<NominationAddModalProps> = ({ isOpen, onClose }) => {
  const { activeRoster } = useRosters();
  const { activeAccount } = useAccounts();
  const { blocApi } = useBlocApiClient();
  const { constants } = usePalletsConstants();
  const rosterConstants = constants("Roster");
  const { balanceFormatter } = useBalanceFormatter();
  const [newNominationDeposit, setNewNominationDeposit] = useState<BigNumber | undefined>(
    undefined,
  );
  const [estimatedFee, setEstimatedFee] = useState<BigNumber | undefined>(undefined);
  const [estimatedTotal, setEstimatedTotal] = useState<BigNumber | undefined>(undefined);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<{ nominee: string }>();

  const nominee = watch("nominee");

  useEffect(() => {
    if ("NewNominationDeposit" in rosterConstants && rosterConstants.NewNominationDeposit) {
      setNewNominationDeposit(BigNumber(rosterConstants.NewNominationDeposit.toString()));
    }
  }, [rosterConstants]);

  useEffect(() => {
    if (activeAccount && activeRoster && isValidAddress(nominee)) {
      (async () => {
        const fee = await blocApi.tx.Roster.nomination_new({
          nominee,
          roster_id: activeRoster.id,
        }).getEstimatedFees(activeAccount.address);
        setEstimatedFee(BigNumber(fee.toString()));
      })();
    } else {
      setEstimatedFee(undefined);
    }
  }, [activeAccount, activeRoster, nominee, blocApi]);

  useEffect(() => {
    if (newNominationDeposit && estimatedFee) {
      setEstimatedTotal(newNominationDeposit.plus(estimatedFee));
    } else {
      setEstimatedTotal(undefined);
    }
  }, [newNominationDeposit, estimatedFee]);

  const onSubmit = (data: { nominee: string }) => {
    console.log(data.nominee);
    handleClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal show={isOpen} onClose={handleClose} dismissible>
      <Modal.Header>Add Nomination</Modal.Header>
      <Modal.Body>
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
            {errors.nominee && (
              <p className="mt-2 text-red-600 text-sm">{errors.nominee.message}</p>
            )}
            <div className="absolute bottom-6 left-0 pl-6">
              <ul className="font-mono text-gray-700 text-xxs dark:text-gray-300">
                <li>
                  <span className="inline-block w-16">Deposit:</span>{" "}
                  {newNominationDeposit ? balanceFormatter(newNominationDeposit) : "?"}
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

export default NominationAdd;
