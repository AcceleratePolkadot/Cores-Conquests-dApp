import type React from "react";
import { useMemo } from "react";

import { useLazyLoadQuery, useMutation } from "@reactive-dot/react";

import type { OptionsObject } from "notistack";

import _ from "lodash";

import { useActiveAccount } from "@/contexts/ActiveAccount";
import { useRosters } from "@/contexts/Rosters";
import type { ExpulsionProposal } from "@/contexts/ExpulsionProposals/types";
import ExpulsionProposalActionsList from "@/components/ExpulsionProposalActionsList";

interface ExpulsionProposalActionsProps {
  proposal: ExpulsionProposal;
}

const ExpulsionProposalActions: React.FC<ExpulsionProposalActionsProps> = ({ proposal }) => {
  const { activeAccount } = useActiveAccount();
  const { getRoster } = useRosters();
  const roster = getRoster(proposal.roster);

  const [currentBlock, awaitingSecondPeriod, votingPeriod, secondThreshold, votesMax] =
    useLazyLoadQuery((builder) =>
      builder
        .readStorage("System", "Number", [])
        .getConstant("Roster", "ExpulsionProposalAwaitingSecondPeriod")
        .getConstant("Roster", "ExpulsionProposalVotingPeriod")
        .getConstant("Roster", "ExpulsionProposalSecondThreshold")
        .getConstant("Roster", "ExpulsionProposalVotesMax"),
    );

  const constants = useMemo(() => {
    return {
      awaitingSecondPeriod,
      votingPeriod,
      secondThreshold,
      votesMax,
    };
  }, [awaitingSecondPeriod, votingPeriod, secondThreshold, votesMax]);

  const isWithinSecondPeriod = useMemo(() => {
    return currentBlock <= proposal.proposed_on + constants.awaitingSecondPeriod;
  }, [currentBlock, proposal.proposed_on, constants.awaitingSecondPeriod]);

  const hasReachedSecondThreshold = useMemo(() => {
    return proposal.seconds.length >= constants.secondThreshold;
  }, [proposal.seconds, constants.secondThreshold]);

  const isWithinVotingPeriod = useMemo(() => {
    if (!proposal.voting_opened_on) return false;
    return currentBlock <= proposal.voting_opened_on + constants.votingPeriod;
  }, [currentBlock, proposal.voting_opened_on, constants.votingPeriod]);

  const userHasVoted = useMemo(() => {
    return proposal.votes.some((vote) => vote.voter === activeAccount?.address);
  }, [activeAccount, proposal.votes]);

  const isMember = useMemo(() => {
    if (!activeAccount || !roster) return false;
    return roster.members.includes(activeAccount.address);
  }, [activeAccount, roster]);

  const userCanVote = useMemo(() => {
    return (
      isMember &&
      proposal.status.type === "Voting" &&
      isWithinVotingPeriod &&
      proposal.votes.length < constants.votesMax &&
      !userHasVoted
    );
  }, [
    proposal.status,
    proposal.votes,
    isMember,
    isWithinVotingPeriod,
    constants.votesMax,
    userHasVoted,
  ]);

  const userCanSecond = useMemo(() => {
    return (
      activeAccount !== undefined &&
      ["Proposed", "Seconded"].includes(proposal.status.type) &&
      isWithinSecondPeriod &&
      activeAccount.address !== proposal.motioner &&
      !proposal.seconds.some((second) => second === activeAccount.address)
    );
  }, [isWithinSecondPeriod, activeAccount, proposal.status, proposal.seconds, proposal.motioner]);

  const userCanOpenVoting = useMemo(() => {
    return (
      isMember &&
      proposal.status.type === "Seconded" &&
      hasReachedSecondThreshold &&
      //@ts-ignore: activeAccount cannot be undefined as we check isMember before
      activeAccount.address === proposal.motioner
    );
  }, [isMember, proposal.status, hasReachedSecondThreshold, activeAccount, proposal.motioner]);

  const didNotReachSecondThreshold = useMemo(() => {
    return (
      !isWithinSecondPeriod &&
      (proposal.status.type === "Proposed" ||
        (proposal.status.type === "Seconded" && !hasReachedSecondThreshold))
    );
  }, [isWithinSecondPeriod, proposal.status, hasReachedSecondThreshold]);

  const canClose = useMemo(() => {
    return (
      isMember &&
      ((proposal.status.type === "Voting" && !isWithinVotingPeriod) || didNotReachSecondThreshold)
    );
  }, [isMember, proposal.status, isWithinVotingPeriod, didNotReachSecondThreshold]);

  const userPermissions = useMemo(() => {
    return {
      second: userCanSecond,
      openVoting: userCanOpenVoting,
      vote: userCanVote,
      recantVote: userHasVoted && isWithinVotingPeriod,
      close: canClose,
    };
  }, [userCanSecond, userCanOpenVoting, userCanVote, userHasVoted, canClose, isWithinVotingPeriod]);

  const options = useMemo(() => {
    return {
      additional: [
        {
          label: "Expulsion Proposal",
          rows: [
            {
              label: "Roster ID",
              value: proposal.roster.asHex(),
            },
            {
              label: "Roster Title",
              value: roster?.title.asText(),
            },
            {
              label: "Motioner",
              value: proposal.motioner,
            },
            {
              label: "Subject",
              value: proposal.subject,
            },
            {
              label: "Status",
              value: proposal.status.type,
            },
          ],
        },
        {
          label: "Seconds",
          rows: [
            {
              label: "Awaiting Second Period",
              value: constants.awaitingSecondPeriod.toLocaleString(),
            },
            {
              label: "In Awaiting Second Period",
              value: isWithinSecondPeriod ? "Yes" : "No",
            },
            {
              label: "Number of Seconds",
              value: proposal.seconds.length.toLocaleString(),
            },
            {
              label: "Second Threshold",
              value: constants.secondThreshold.toLocaleString(),
            },
            {
              label: "Has Reached Second Threshold",
              value: hasReachedSecondThreshold ? "Yes" : "No",
            },
            ...proposal.seconds.map((second, index) => ({
              label: `#${index + 1}`,
              value: second,
            })),
          ],
        },
        {
          label: "Current Vote Counts",
          rows: [
            {
              label: "Voting Period",
              value: constants.votingPeriod.toLocaleString(),
            },
            {
              label: "In Voting Period",
              value: isWithinVotingPeriod ? "Yes" : "No",
            },
            {
              label: "Maximum Number of Votes",
              value: constants.votesMax.toLocaleString(),
            },
            {
              label: "Ayes",
              value: proposal.votes
                .filter((vote) => vote.vote.type === "Aye")
                .length.toLocaleString(),
            },
            {
              label: "Nays",
              value: proposal.votes
                .filter((vote) => vote.vote.type === "Nay")
                .length.toLocaleString(),
            },
            {
              label: "Abstains",
              value: proposal.votes
                .filter((vote) => vote.vote.type === "Abstain")
                .length.toLocaleString(),
            },
            {
              label: "Total Votes Cast",
              value: proposal.votes.length.toLocaleString(),
            },
            {
              label: "Percentage of Membership which has voted",
              value:
                roster && `${((proposal.votes.length / roster.members.length) * 100).toFixed(2)}%`,
            },
          ],
        },
      ],
    } as OptionsObject<"mutationPending">;
  }, [
    constants,
    isWithinSecondPeriod,
    hasReachedSecondThreshold,
    isWithinVotingPeriod,
    proposal.motioner,
    proposal.roster,
    proposal.subject,
    proposal.status,
    proposal.seconds,
    proposal.votes,
    roster,
  ]);

  const transactions = {
    second: useMutation((tx) =>
      tx.Roster.expulsion_proposal_second({
        motioner: proposal.motioner,
        roster_id: proposal.roster,
        subject: proposal.subject,
      }),
    ),
    openVoting: useMutation((tx) =>
      tx.Roster.expulsion_vote_open({
        roster_id: proposal.roster,
        subject: proposal.subject,
      }),
    ),
    voteAye: useMutation((tx) =>
      tx.Roster.expulsion_vote_submit_vote({
        motioner: proposal.motioner,
        roster_id: proposal.roster,
        subject: proposal.subject,
        vote: { type: "Aye", value: undefined },
      }),
    ),
    voteNay: useMutation((tx) =>
      tx.Roster.expulsion_vote_submit_vote({
        motioner: proposal.motioner,
        roster_id: proposal.roster,
        subject: proposal.subject,
        vote: { type: "Nay", value: undefined },
      }),
    ),
    abstain: useMutation((tx) =>
      tx.Roster.expulsion_vote_submit_vote({
        motioner: proposal.motioner,
        roster_id: proposal.roster,
        subject: proposal.subject,
        vote: { type: "Abstain", value: undefined },
      }),
    ),
    recantVote: useMutation((tx) =>
      tx.Roster.expulsion_vote_recant_vote({
        motioner: proposal.motioner,
        roster_id: proposal.roster,
        subject: proposal.subject,
      }),
    ),
    close: useMutation((tx) =>
      tx.Roster.expulsion_proposal_close({
        motioner: proposal.motioner,
        roster_id: proposal.roster,
        subject: proposal.subject,
      }),
    ),
  };

  const actions = useMemo(() => {
    return [
      {
        label: "Second",
        transaction: transactions.second,
        enabled: userPermissions.second,
        notifications: {
          pending: {
            message: "Seconding proposal...",
            options,
          },
          success: {
            message: "Proposal seconded successfully",
            options,
          },
          failure: {
            message: "Failed to second proposal",
            options,
          },
        },
      },
      {
        label: "Open Voting",
        transaction: transactions.openVoting,
        enabled: userPermissions.openVoting,
        notifications: {
          pending: {
            message: "Opening voting",
            options,
          },
          success: {
            message: "Voting opened successfully",
            options,
          },
          failure: {
            message: "Failed to open voting",
            options,
          },
        },
      },
      {
        label: "Vote Aye",
        transaction: transactions.voteAye,
        enabled: userPermissions.vote,
        notifications: {
          pending: {
            message: "Voting Aye",
            options,
          },
          success: {
            message: "Voted Aye successfully",
            options,
          },
          failure: {
            message: "Failed to vote Aye",
            options,
          },
        },
      },
      {
        label: "Vote Nay",
        transaction: transactions.voteNay,
        enabled: userPermissions.vote,
        notifications: {
          pending: {
            message: "Voting Nay",
            options,
          },
          success: {
            message: "Voted Nay successfully",
            options,
          },
          failure: {
            message: "Failed to vote Nay",
            options,
          },
        },
      },
      {
        label: "Abstain",
        transaction: transactions.abstain,
        enabled: userPermissions.vote,
        notifications: {
          pending: {
            message: "Abstaining from vote",
            options,
          },
          success: {
            message: "Abstained from vote successfully",
            options,
          },
          failure: {
            message: "Failed to abstain from vote",
            options,
          },
        },
      },
      {
        label: "Recant",
        transaction: transactions.recantVote,
        enabled: userPermissions.recantVote,
        notifications: {
          pending: {
            message: "Recanting vote",
            options,
          },
          success: {
            message: "Recanted vote successfully",
            options,
          },
          failure: {
            message: "Failed to recant vote",
            options,
          },
        },
      },
      {
        label: "Close Proposal",
        transaction: transactions.close,
        enabled: userPermissions.close,
        notifications: {
          pending: {
            message: "Closing proposal",
            options,
          },
          success: {
            message: "Proposal closed successfully",
            options,
          },
          failure: {
            message: "Failed to close proposal",
            options,
          },
        },
      },
    ];
  }, [
    options,
    userPermissions,
    transactions.abstain,
    transactions.close,
    transactions.openVoting,
    transactions.recantVote,
    transactions.second,
    transactions.voteAye,
    transactions.voteNay,
  ]);

  return <ExpulsionProposalActionsList actions={actions} />;
};

export default ExpulsionProposalActions;
