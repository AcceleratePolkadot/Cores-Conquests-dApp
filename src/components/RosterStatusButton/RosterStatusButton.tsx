import { Button } from "flowbite-react";
import type React from "react";

import { useRosters } from "@/contexts/Rosters/Rosters";
import type { Roster } from "@/contexts/Rosters/types";
import type { WalletAccount } from "@reactive-dot/core/wallets.js";

import { MutationError, idle, pending } from "@reactive-dot/core";
import { useMutation } from "@reactive-dot/react";
import { useEffect, useState } from "react";
import { GiCrossedBones, GiHeartPlus } from "react-icons/gi";

import { useNotifications } from "@/contexts/Notifications";

import type { NotificationKey } from "@/contexts/Notifications/types";
import type { OptionsObject } from "notistack";
import type { TxEvent } from "polkadot-api";
import { MdTitle } from "react-icons/md";

import { FaKey } from "react-icons/fa6";

interface RosterStatusButtonProps {
  roster: Roster;
  account: WalletAccount;
}

export const RosterStatusButton: React.FC<RosterStatusButtonProps> = ({ roster, account }) => {
  const { refreshRosters } = useRosters();
  const { showStatusNotification, updateStatusNotification } = useNotifications();
  const [deactivateRosterWorking, setDeactivateRosterWorking] = useState<boolean>(false);
  const [activateRosterWorking, setActivateRosterWorking] = useState<boolean>(false);
  const [deactivateRosterStatusKey, setDeactivateRosterStatusKey] = useState<
    NotificationKey | undefined
  >(undefined);
  const [activateRosterStatusKey, setActivateRosterStatusKey] = useState<
    NotificationKey | undefined
  >(undefined);

  const [deactivateRosterState, deactivateRoster] = useMutation(
    (tx) =>
      tx.Roster.roster_deactivate({
        roster_id: roster.id,
      }),
    { signer: account.polkadotSigner },
  );
  const [activateRosterState, activateRoster] = useMutation(
    (tx) => tx.Roster.roster_activate({ roster_id: roster.id }),
    { signer: account.polkadotSigner },
  );

  const options = {
    account: account,
    additional: [
      {
        label: "Roster",
        rows: [
          {
            icon: <FaKey title="Roster ID" />,
            value: roster.id.asHex(),
            tooltip: "Roster ID",
          },
          {
            icon: <MdTitle title="Roster Name" />,
            value: roster.title.asText(),
            copy: false,
            tooltip: "Roster Name",
          },
        ],
      },
    ],
  } as OptionsObject<"mutationPending">;

  useEffect(() => {
    if (deactivateRosterWorking) {
      if (
        deactivateRosterState !== pending &&
        deactivateRosterState !== idle &&
        (deactivateRosterState instanceof MutationError ||
          (deactivateRosterState as TxEvent).type === "finalized")
      ) {
        refreshRosters();
        setDeactivateRosterWorking(false);
        if (deactivateRosterStatusKey) {
          updateStatusNotification(deactivateRosterStatusKey, deactivateRosterState);
          setDeactivateRosterStatusKey(undefined);
        }
      }
    }
  }, [
    deactivateRosterState,
    refreshRosters,
    deactivateRosterWorking,
    deactivateRosterStatusKey,
    updateStatusNotification,
  ]);

  useEffect(() => {
    if (activateRosterWorking) {
      if (
        activateRosterState !== pending &&
        activateRosterState !== idle &&
        (activateRosterState instanceof MutationError ||
          (activateRosterState as TxEvent).type === "finalized")
      ) {
        refreshRosters();
        setActivateRosterWorking(false);
        if (activateRosterStatusKey) {
          updateStatusNotification(activateRosterStatusKey, activateRosterState);
          setActivateRosterStatusKey(undefined);
        }
      }
    }
  }, [
    activateRosterState,
    refreshRosters,
    activateRosterWorking,
    activateRosterStatusKey,
    updateStatusNotification,
  ]);

  const onDeactivateRoster = () => {
    if (!deactivateRosterWorking) {
      deactivateRoster();
      setDeactivateRosterWorking(true);
      const statusKey = showStatusNotification({
        status: deactivateRosterState,
        pending: {
          message: "Deactivating Roster",
          options,
        },
        success: {
          message: "Roster deactivated!",
          options,
        },
        failure: {
          message: "Roster deactivation failed!",
          options,
        },
      });
      setDeactivateRosterStatusKey(statusKey);
    }
  };

  const onActivateRoster = () => {
    if (!activateRosterWorking) {
      activateRoster();
      setActivateRosterWorking(true);

      const statusKey = showStatusNotification({
        status: activateRosterState,
        pending: {
          message: "Activating Roster",
          options,
        },
        success: {
          message: "Roster activated!",
          options,
        },
        failure: {
          message: "Roster activation failed!",
          options,
        },
      });
      setActivateRosterStatusKey(statusKey);
    }
  };

  return (
    <>
      {roster.founder === account?.address && (
        <div className="flex justify-center space-x-4 p-6">
          {roster.status.type === "Active" ? (
            <Button
              onClick={onDeactivateRoster}
              size="lg"
              gradientMonochrome="failure"
              disabled={deactivateRosterWorking || activateRosterWorking}
            >
              <GiCrossedBones className="mr-2 h-6 w-6" /> Deactivate
            </Button>
          ) : (
            <>
              <Button
                onClick={onActivateRoster}
                size="lg"
                gradientMonochrome="success"
                disabled={deactivateRosterWorking || activateRosterWorking}
              >
                <GiHeartPlus className="mr-2 h-4 w-4" /> Re-Activate
              </Button>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default RosterStatusButton;
