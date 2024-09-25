import type { Periods } from "@/components/PeriodProgress/types";
import { calculateProgress } from "@/components/PeriodProgress/utils";
import { Polkicon, Rosticon } from "@/components/identicons";
import { useAccounts } from "@/contexts/Accounts";
import type { AccountId } from "@/contexts/Accounts/types";
import { useBlocks } from "@/contexts/Blocks";
import type { Nomination } from "@/contexts/Nominations/types";
import { usePalletsConstants } from "@/contexts/PalletsConstants";
import { useRosters } from "@/contexts/Rosters";
import { Button, Modal, Tabs, Tooltip } from "flowbite-react";
import Pluralize from "pluralize";
import type React from "react";
import { useEffect, useState } from "react";
import { FaVoteYea } from "react-icons/fa";
import { FaCircleCheck, FaCircleMinus } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";

interface NominationVoteProps {
  nomination: Nomination;
}

const NominationVote: React.FC<NominationVoteProps> = ({ nomination }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { activeRoster } = useRosters();
  const { activeAccount } = useAccounts();
  const { currentBlock } = useBlocks();
  const { constants } = usePalletsConstants();
  const rosterConstants = constants("Roster");
  const [votingPeriod, setVotingPeriod] = useState<Periods | undefined>(undefined);

  useEffect(() => {
    if ("NominationVotingPeriod" in rosterConstants) {
      const period = calculateProgress({
        periodStart: nomination.nominated_on,
        periodDuration: rosterConstants.NominationVotingPeriod as number,
        currentBlock,
      });
      setVotingPeriod(period);
    }
  }, [currentBlock, nomination, rosterConstants]);

  const canVote = () => {
    return (
      activeRoster !== undefined &&
      activeAccount !== undefined &&
      activeRoster.members.some((member) => member === activeAccount.address) &&
      nomination.status.type === "Pending" &&
      votingPeriod?.percentPassed !== 100
    );
  };

  const handleOpenModal = () => {
    if (canVote()) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <NominationVoteButton onClick={handleOpenModal} disabled={!canVote()} />
      <NominationVoteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        nomination={nomination}
        votingPeriod={votingPeriod}
      />
    </div>
  );
};

interface NominationVoteButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const NominationVoteButton: React.FC<NominationVoteButtonProps> = ({ onClick, disabled }) => {
  return (
    <Tooltip
      content={disabled ? "Voting period has ended" : "Vote on Nomination"}
      placement="right"
    >
      <Button gradientDuoTone="tealToLime" size="xs" onClick={onClick} disabled={disabled}>
        <FaVoteYea />
      </Button>
    </Tooltip>
  );
};

interface NominationVoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  nomination: Nomination;
  votingPeriod: Periods | undefined;
}

const NominationVoteModal: React.FC<NominationVoteModalProps> = ({
  isOpen,
  onClose,
  nomination,
  votingPeriod,
}) => {
  const { activeRoster } = useRosters();
  const { activeAccount } = useAccounts();
  const [ayeVoters, setAyeVoters] = useState<{ address: AccountId }[]>([]);
  const [nayVoters, setNayVoters] = useState<{ address: AccountId }[]>([]);
  const [notVotedMembers, setNotVotedMembers] = useState<{ address: AccountId }[]>([]);
  const [voteStatus, setVoteStatus] = useState<string>("unknown");

  useEffect(() => {
    if (nomination) {
      setAyeVoters(
        nomination.votes
          .filter((vote) => vote.vote.type === "Aye")
          .map((vote) => ({ address: vote.voter })),
      );
      setNayVoters(
        nomination.votes
          .filter((vote) => vote.vote.type === "Nay")
          .map((vote) => ({ address: vote.voter })),
      );
      setNotVotedMembers(
        activeRoster?.members
          .filter((member) => !nomination.votes.some((vote) => vote.voter === member))
          .map((member) => ({ address: member })) || [],
      );
    }
  }, [nomination, activeRoster]);

  useEffect(() => {
    const tense = (votingPeriod?.periodRemaining ?? 0) > 0 ? "ing" : "ed";
    setVoteStatus(
      ayeVoters && nayVoters && ayeVoters.length > nayVoters.length
        ? `Pass${tense}`
        : `Fail${tense}`,
    );
  }, [ayeVoters, nayVoters, votingPeriod]);

  const handleVote = (vote: "aye" | "nay" | "recant") => {
    console.log({
      rosterId: activeRoster?.id.asHex(),
      nomination,
      activeAccount: activeAccount?.address,
      vote,
    });
    onClose();
  };

  const renderPolkicons = (members: { address: AccountId }[], max = 20) => {
    const displayed = members.slice(0, max);
    const remaining = members.length - max;

    return (
      <>
        {displayed.map((member) => (
          <div key={member.address}>
            <Polkicon address={member.address} />
          </div>
        ))}
        {remaining > 0 && (
          <div className="h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-xs">
            +{remaining}
          </div>
        )}
      </>
    );
  };

  return (
    <Modal show={isOpen} onClose={onClose} dismissible>
      <Modal.Header>Vote on Nomination</Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <Polkicon address={nomination.nominator} size="6rem" copy={true} />

              <span className="text-gray-400 dark:text-gray-600">→</span>

              <Polkicon address={nomination.nominee} size="6rem" copy={true} />

              <span className="text-gray-400 dark:text-gray-600">→</span>

              <Rosticon rosterId={activeRoster?.id} className="h-24 w-24" copy={true} />
            </div>
          </div>
          <div>
            <h2 className="mb-1 text-center text-gray-600 text-sm dark:text-gray-400">
              {`${voteStatus} (${ayeVoters.length} to ${nayVoters.length})`}
            </h2>
            <h3 className="text-center text-gray-400 text-xs dark:text-gray-600">
              {`with ${
                votingPeriod
                  ? votingPeriod.periodRemaining > 0
                    ? votingPeriod.periodRemaining
                    : "0"
                  : "?"
              } ${Pluralize("block", votingPeriod?.periodRemaining ?? 0)} remaining`}
            </h3>
          </div>
          <Tabs aria-label="Vote Tabs" variant="underline">
            <Tabs.Item active title="Ayes" icon={FaCircleCheck}>
              <div className="grid min-h-20 grid-cols-8 gap-2">{renderPolkicons(ayeVoters)}</div>
            </Tabs.Item>
            <Tabs.Item active title="Nays" icon={IoIosCloseCircle}>
              <div className="grid min-h-20 grid-cols-8 gap-2">{renderPolkicons(nayVoters)}</div>
            </Tabs.Item>
            <Tabs.Item active title="Not Voted" icon={FaCircleMinus}>
              <div className="grid min-h-20 grid-cols-8 gap-2">
                {renderPolkicons(notVotedMembers)}
              </div>
            </Tabs.Item>
          </Tabs>
          <div className="flex justify-center space-x-2">
            {activeAccount &&
            !ayeVoters.some((v) => v.address === activeAccount.address) &&
            !nayVoters.some((v) => v.address === activeAccount.address) ? (
              <>
                <Button gradientDuoTone="greenToBlue" onClick={() => handleVote("aye")}>
                  Vote Aye
                </Button>
                <Button gradientDuoTone="purpleToPink" onClick={() => handleVote("nay")}>
                  Vote Nay
                </Button>
              </>
            ) : (
              <Button gradientDuoTone="redToYellow" onClick={() => handleVote("recant")}>
                Recant Vote
              </Button>
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default NominationVote;
