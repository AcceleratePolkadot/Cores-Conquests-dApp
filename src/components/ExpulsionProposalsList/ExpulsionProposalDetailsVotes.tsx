import type { ExpulsionProposal } from "@/contexts/ExpulsionProposals/types";
import type React from "react";
import { FaCircleCheck, FaCircleMinus, FaCircleXmark } from "react-icons/fa6";

import { useRosters } from "@/contexts/Rosters";
import { Polkicon } from "@w3ux/react-polkicon";

import { Button } from "flowbite-react";

interface ExpulsionProposalDetailsVotesProps {
  proposal: ExpulsionProposal;
}

const ExpulsionProposalDetailsVotes: React.FC<ExpulsionProposalDetailsVotesProps> = ({
  proposal,
}) => {
  const { getRoster } = useRosters();
  const roster = getRoster(proposal.roster);

  if (!roster) {
    return null;
  }

  return (
    <div className="border-gray-100 border-t px-4 py-6 sm:col-span-2 sm:px-0">
      <dt className="font-medium text-gray-900 text-sm/6">Votes</dt>
      <dd className="mt-2 text-gray-900 text-sm">
        <ul className="divide-y divide-gray-100 rounded-md border border-gray-200">
          <li className="flex items-center justify-between py-4 pr-5 pl-4">
            <div className="flex w-0 flex-1 items-center">
              <FaCircleCheck aria-hidden="true" className="size-5 shrink-0 text-gray-400" />
              <div className="ml-4 flex min-w-0 flex-1 gap-2">
                {proposal.votes
                  .filter((vote) => vote.vote.type === "Aye")
                  .slice(0, 10)
                  .map((vote) => (
                    <div key={vote.voter}>
                      <Polkicon address={vote.voter} transform="grow-10" background="none" />
                    </div>
                  ))}
                {proposal.votes.filter((vote) => vote.vote.type === "Aye").length > 10 && (
                  <div className="text-gray-400">
                    +{proposal.votes.filter((vote) => vote.vote.type === "Aye").length - 10} others
                  </div>
                )}
              </div>
            </div>
            <div className="ml-4">
              <Button color="gray" pill size="xs">
                Aye
              </Button>
            </div>
          </li>
          <li className="flex items-center justify-between py-4 pr-5 pl-4">
            <div className="flex w-0 flex-1 items-center">
              <FaCircleXmark aria-hidden="true" className="size-5 shrink-0 text-gray-400" />
              <div className="ml-4 flex min-w-0 flex-1 gap-2">
                {proposal.votes
                  .filter((vote) => vote.vote.type === "Nay")
                  .map((vote) => (
                    <div key={vote.voter}>
                      <Polkicon address={vote.voter} transform="grow-10" background="none" />
                    </div>
                  ))}
                {proposal.votes.filter((vote) => vote.vote.type === "Nay").length > 10 && (
                  <div className="text-gray-400">
                    +{proposal.votes.filter((vote) => vote.vote.type === "Nay").length - 10} others
                  </div>
                )}
              </div>
            </div>
            <div className="ml-4">
              <Button color="gray" pill size="xs">
                Nay
              </Button>
            </div>
          </li>
          <li className="flex items-center justify-between py-4 pr-5 pl-4">
            <div className="flex w-0 flex-1 items-center">
              <FaCircleMinus aria-hidden="true" className="size-5 shrink-0 text-gray-400" />
              <div className="ml-4 flex min-w-0 flex-1 gap-2">
                {proposal.votes
                  .filter((vote) => vote.vote.type === "Abstain")
                  .map((vote) => (
                    <div key={vote.voter}>
                      <Polkicon address={vote.voter} transform="grow-10" background="none" />
                    </div>
                  ))}
                {proposal.votes.filter((vote) => vote.vote.type === "Abstain").length > 10 && (
                  <div className="text-gray-400">
                    +{proposal.votes.filter((vote) => vote.vote.type === "Abstain").length - 10}{" "}
                    others
                  </div>
                )}
              </div>
            </div>
            <div className="ml-4">
              <Button color="gray" pill size="xs">
                Abstain
              </Button>
            </div>
          </li>
        </ul>
      </dd>
    </div>
  );
};

export default ExpulsionProposalDetailsVotes;
