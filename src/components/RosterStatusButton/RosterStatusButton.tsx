import { Button } from "flowbite-react";
import type React from "react";

import type { Roster } from "@/contexts/Rosters/types";
import type { WalletAccount } from "@reactive-dot/core/wallets.js";

import { MutationError, idle, pending } from "@reactive-dot/core";
import { useMutation, useMutationEffect } from "@reactive-dot/react";
import { GiCrossedBones, GiHeartPlus } from "react-icons/gi";

interface RosterStatusButtonProps {
  roster: Roster;
  account: WalletAccount;
}

export const RosterStatusButton: React.FC<RosterStatusButtonProps> = ({ roster, account }) => {
  const [deactivateRosterState, deactivateRoster] = useMutation(
    (tx) => tx.Roster.roster_deactivate({ roster_id: roster.id }),
    { signer: account.polkadotSigner },
  );

  const [activateRosterState, activateRoster] = useMutation(
    (tx) => tx.Roster.roster_activate({ roster_id: roster.id }),
    { signer: account.polkadotSigner },
  );

  useMutationEffect((event) => {
    if (event.value === pending) {
      console.log("Submitting transaction", { id: event.id });
      return;
    }

    if (event.value instanceof MutationError) {
      console.error("Failed to submit transaction", { id: event.id });
      return;
    }

    switch (event.value.type) {
      case "finalized":
        if (event.value.ok) {
          console.log("Transaction succeeded", { id: event.id });
        } else {
          console.error("Transaction failed", { id: event.id });
        }
        break;
      default:
        console.log("Transaction pending", { id: event.id });
    }
  });

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
