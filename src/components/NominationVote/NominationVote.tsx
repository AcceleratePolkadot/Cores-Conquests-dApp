import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { MutationError, idle, pending } from "@reactive-dot/core";
import { useLazyLoadQuery, useMutation } from "@reactive-dot/react";
import { Button, Dropdown, Tooltip } from "flowbite-react";
import type { OptionsObject } from "notistack";
import type { TxEvent } from "polkadot-api";

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaEllipsisVertical, FaFlagCheckered, FaThumbsDown, FaThumbsUp } from "react-icons/fa6";
import { MdPersonAddAlt1 } from "react-icons/md";
import { TbTrashXFilled } from "react-icons/tb";

import { useActiveAccount } from "@/contexts/ActiveAccount";
import type { Nomination } from "@/contexts/Nominations/types";
import { useNotifications } from "@/contexts/Notifications";
import type { NotificationKey, StatusNotification } from "@/contexts/Notifications/types";
import { useRosters } from "@/contexts/Rosters";

import { comparators } from "@/utils/comparators";

interface NominationVoteProps {
  nomination: Nomination;
}

type ActionTypes = "Aye" | "Nay" | "Recant" | "Close" | "Join";

const NominationVote: React.FC<NominationVoteProps> = ({ nomination }) => {
  const { activeAccount } = useActiveAccount();
  const { getRoster } = useRosters();
  const { showStatusNotification, updateStatusNotification } = useNotifications();
  const [actionInProgress, setActionInProgress] = useState<boolean>(false);
  const [statusNotificationKeys, setStatusNotificationKeys] = useState<
    Record<ActionTypes, NotificationKey | undefined>
  >({
    Aye: undefined,
    Nay: undefined,
    Recant: undefined,
    Close: undefined,
    Join: undefined,
  });

  const mutationStates = useRef<Record<ActionTypes, StatusNotification["status"]>>({
    Aye: idle,
    Nay: idle,
    Recant: idle,
    Close: idle,
    Join: idle,
  });

  const [nominationVotingPeriod, currentBlock] = useLazyLoadQuery((builder) =>
    builder.getConstant("Roster", "NominationVotingPeriod").readStorage("System", "Number", []),
  );

  const [voteAyeState, submitVoteAye] = useMutation(
    (tx) =>
      tx.Roster.nomination_vote({
        roster_id: nomination.roster,
        nominee: nomination.nominee,
        vote: { type: "Aye", value: undefined },
      }),
    { signer: activeAccount?.polkadotSigner },
  );

  const [voteNayState, submitVoteNay] = useMutation(
    (tx) =>
      tx.Roster.nomination_vote({
        roster_id: nomination.roster,
        nominee: nomination.nominee,
        vote: { type: "Nay", value: undefined },
      }),
    { signer: activeAccount?.polkadotSigner },
  );

  const [recantState, submitRecant] = useMutation(
    (tx) =>
      tx.Roster.nomination_recant_vote({
        roster_id: nomination.roster,
        nominee: nomination.nominee,
      }),
    { signer: activeAccount?.polkadotSigner },
  );

  const [closeState, submitClose] = useMutation(
    (tx) =>
      tx.Roster.nomination_close({
        roster_id: nomination.roster,
        nominee: nomination.nominee,
      }),
    { signer: activeAccount?.polkadotSigner },
  );

  const [joinState, submitJoin] = useMutation(
    (tx) =>
      tx.Roster.add_member({
        roster_id: nomination.roster,
      }),
    { signer: activeAccount?.polkadotSigner },
  );

  useEffect(() => {
    updateCorrectStatusNotification({ action: "Aye", status: voteAyeState });
  }, [voteAyeState]);

  useEffect(() => {
    updateCorrectStatusNotification({ action: "Nay", status: voteNayState });
  }, [voteNayState]);

  useEffect(() => {
    updateCorrectStatusNotification({ action: "Recant", status: recantState });
  }, [recantState]);

  useEffect(() => {
    updateCorrectStatusNotification({ action: "Close", status: closeState });
  }, [closeState]);

  useEffect(() => {
    updateCorrectStatusNotification({ action: "Join", status: joinState });
  }, [joinState]);

  const updateCorrectStatusNotification = (state: {
    action: ActionTypes;
    status: StatusNotification["status"];
  }) => {
    const { action, status } = state;
    if (actionInProgress) {
      if (
        statusNotificationKeys[action] &&
        !comparators.mutationStateIsEqual(mutationStates.current[action], status)
      ) {
        mutationStates.current[action] = status;
        updateStatusNotification(statusNotificationKeys[action], status);
      }
      if (
        status !== pending &&
        status !== idle &&
        (status instanceof MutationError || (status as TxEvent).type === "finalized")
      ) {
        setActionInProgress(false);
        setStatusNotificationKeys((prev) => ({ ...prev, [action]: undefined }));
        mutationStates.current[action] = idle;
      }
    }
  };

  const votingEnded = useMemo(() => {
    const periodEnd = nomination.nominated_on + nominationVotingPeriod;
    return currentBlock >= periodEnd;
  }, [currentBlock, nomination.nominated_on, nominationVotingPeriod]);

  const userVote = useMemo(() => {
    if (!activeAccount) return undefined;
    return nomination.votes.find((vote) => vote.voter === activeAccount.address);
  }, [activeAccount, nomination.votes]);

  const showCorrectStatusNotification = (statusNotification: {
    action: ActionTypes;
    status: StatusNotification["status"];
    messages: Record<
      "pending" | "success" | "failure",
      {
        message: string;
        options: OptionsObject<"mutationPending">;
      }
    >;
  }) => {
    const { action, status, messages } = statusNotification;
    const $notificationKey = showStatusNotification({
      status,
      pending: messages.pending,
      success: messages.success,
      failure: messages.failure,
    });
    setStatusNotificationKeys((prev) => ({ ...prev, [action]: $notificationKey }));
  };

  const handleVote = async (vote: "Aye" | "Nay") => {
    if (!activeAccount) return;

    setActionInProgress(true);

    const options = {
      additional: [
        {
          label: "Vote",
          rows: [
            {
              label: "Roster ID",
              value: nomination.roster.asHex(),
            },
            {
              label: "Nominee",
              value: nomination.nominee,
            },
            {
              label: "Vote",
              value: vote,
            },
          ],
        },
      ],
    } as OptionsObject<"mutationPending">;

    const voteState = {
      Aye: () => {
        submitVoteAye();
        return voteAyeState;
      },
      Nay: () => {
        submitVoteNay();
        return voteNayState;
      },
    }[vote]();

    showCorrectStatusNotification({
      action: vote,
      status: voteState,
      messages: {
        pending: {
          message: "Submitting Nomination Vote",
          options,
        },
        success: {
          message: "Nomination vote submitted!",
          options,
        },
        failure: {
          message: "Nomination vote submission failed!",
          options,
        },
      },
    });
  };

  const handleRecant = async () => {
    if (!activeAccount) return;

    setActionInProgress(true);

    const options = {
      additional: [
        {
          label: "Recanting",
          rows: [
            {
              label: "Roster ID",
              value: nomination.roster.asHex(),
            },
            {
              label: "Nominee",
              value: nomination.nominee,
            },
            {
              label: "Current Vote",
              value: userVote?.vote.type ?? "Unknown",
            },
          ],
        },
      ],
    } as OptionsObject<"mutationPending">;

    submitRecant();
    showCorrectStatusNotification({
      action: "Recant",
      status: recantState,
      messages: {
        pending: {
          message: "Recanting Nomination Vote",
          options,
        },
        success: {
          message: "Nomination vote recanted!",
          options,
        },
        failure: {
          message: "Nomination vote recant failed!",
          options,
        },
      },
    });
  };

  const handleClose = async () => {
    if (!activeAccount) return;

    setActionInProgress(true);

    const options = {
      additional: [
        {
          label: "Close",
          rows: [
            {
              label: "Roster ID",
              value: nomination.roster.asHex(),
            },
            {
              label: "Nominee",
              value: nomination.nominee,
            },
            {
              label: "Aye Votes",
              value: nomination.votes.filter((vote) => vote.vote.type === "Aye").length,
            },
            {
              label: "Nay Votes",
              value: nomination.votes.filter((vote) => vote.vote.type === "Nay").length,
            },
            {
              label: "Nominated On",
              value: nomination.nominated_on,
            },
            {
              label: "Nomination Voting Period",
              value: nominationVotingPeriod,
            },
          ],
        },
      ],
    } as OptionsObject<"mutationPending">;

    submitClose();

    showCorrectStatusNotification({
      action: "Close",
      status: closeState,
      messages: {
        pending: {
          message: "Closing Nomination",
          options,
        },
        success: {
          message: "Nomination closed!",
          options,
        },
        failure: {
          message: "Nomination close failed!",
          options,
        },
      },
    });
  };

  const handleJoin = async () => {
    if (!activeAccount) return;

    setActionInProgress(true);

    const options = {
      additional: [
        {
          label: "Nomination",
          rows: [
            {
              label: "Nominee",
              value: nomination.nominee,
            },
            {
              label: "Aye Votes",
              value: nomination.votes.filter((vote) => vote.vote.type === "Aye").length,
            },
            {
              label: "Nay Votes",
              value: nomination.votes.filter((vote) => vote.vote.type === "Nay").length,
            },
            {
              label: "Nominated On",
              value: nomination.nominated_on,
            },
          ],
        },
      ],
    } as OptionsObject<"mutationPending">;

    const roster = getRoster(nomination.roster);
    if (roster) {
      //@ts-ignore: We know additional exists as we add it above
      options.additional.push({
        label: "Roster",
        rows: [
          {
            label: "Roster ID",
            value: roster.id.asHex(),
          },
          {
            label: "Roster Name",
            value: roster.title.asText(),
          },
          {
            label: "Founded By",
            value: roster.founder,
          },
          {
            label: "Founded On",
            value: roster.founded_on,
          },
        ],
      });
    }

    submitJoin();

    showCorrectStatusNotification({
      action: "Join",
      status: joinState,
      messages: {
        pending: {
          message: "Joining Roster",
          options,
        },
        success: {
          message: "Joined Roster!",
          options,
        },
        failure: {
          message: "Joining Roster failed!",
          options,
        },
      },
    });
  };

  if (!activeAccount) return null;

  if (votingEnded) {
    if (nomination.status.type === "Approved" && nomination.nominee === activeAccount.address) {
      return (
        <Tooltip content="Join" animation="duration-1000" placement="left">
          <Button onClick={handleJoin} size="xs" color="purple">
            {actionInProgress ? (
              <AiOutlineLoading3Quarters className="animate-spin" />
            ) : (
              <MdPersonAddAlt1 />
            )}
          </Button>
        </Tooltip>
      );
    }

    if (nomination.status.type !== "Approved" && nomination.status.type !== "Rejected") {
      return (
        <Tooltip content="Close" animation="duration-1000" placement="left">
          <Button onClick={handleClose} size="xs" color="warning">
            {actionInProgress ? (
              <AiOutlineLoading3Quarters className="animate-spin" />
            ) : (
              <FaFlagCheckered />
            )}
          </Button>
        </Tooltip>
      );
    }
  }

  return (
    !votingEnded && (
      <Dropdown
        label={
          actionInProgress ? (
            <AiOutlineLoading3Quarters className="animate-spin" />
          ) : (
            <FaEllipsisVertical />
          )
        }
        dismissOnClick={true}
        inline
        arrowIcon={false}
        disabled={actionInProgress}
      >
        {!userVote ? (
          <>
            <Dropdown.Item onClick={() => handleVote("Aye")}>
              <FaThumbsUp className="mr-2 text-emerald-500" /> Vote Aye
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleVote("Nay")}>
              <FaThumbsDown className="mr-2 text-red-600" /> Vote Nay
            </Dropdown.Item>
          </>
        ) : (
          <Dropdown.Item onClick={handleRecant}>
            <TbTrashXFilled className="mr-2 text-amber-600" /> Recant Vote
          </Dropdown.Item>
        )}
      </Dropdown>
    )
  );
};

export default NominationVote;
