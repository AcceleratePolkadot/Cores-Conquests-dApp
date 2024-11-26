import { Button } from "flowbite-react";
import type React from "react";

import { useRosters } from "@/contexts/Rosters/Rosters";
import type { Roster } from "@/contexts/Rosters/types";
import type { WalletAccount } from "@reactive-dot/core/wallets.js";

import { MutationError, idle, pending } from "@reactive-dot/core";
import { useMutation } from "@reactive-dot/react";
import { useEffect } from "react";
import { GiCrossedBones, GiHeartPlus } from "react-icons/gi";

import type { TxEvent } from "polkadot-api";

interface RosterStatusButtonProps {
  roster: Roster;
  account: WalletAccount;
}

export const RosterStatusButton: React.FC<RosterStatusButtonProps> = ({ roster, account }) => {
  const { refreshRosters } = useRosters();
  const [deactivateRosterState, deactivateRoster] = useMutation(
    (tx) => tx.Roster.roster_deactivate({ roster_id: roster.id }),
    { signer: account.polkadotSigner },
  );
  const [activateRosterState, activateRoster] = useMutation(
    (tx) => tx.Roster.roster_activate({ roster_id: roster.id }),
    { signer: account.polkadotSigner },
  );

  useEffect(() => {
    for (const state of [deactivateRosterState, activateRosterState]) {
      if (
        state !== pending &&
        state !== idle &&
        (state instanceof MutationError || (state as TxEvent).type === "finalized")
      ) {
        refreshRosters();
      }
    }
  }, [deactivateRosterState, activateRosterState, refreshRosters]);

  const onDeactivateRoster = () => {
    deactivateRoster();
  };

  const onActivateRoster = () => {
    activateRoster();
  };

  return (
    <>
      {roster.founder === account?.address && (
        <div className="flex justify-center space-x-4 p-6">
          {roster.status.type === "Active" ? (
            <Button onClick={onDeactivateRoster} size="lg" gradientMonochrome="failure">
              <GiCrossedBones className="mr-2 h-6 w-6" /> Deactivate
            </Button>
          ) : (
            <>
              <Button onClick={onActivateRoster} size="lg" gradientMonochrome="success">
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
