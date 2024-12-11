import type { ExpulsionProposal } from "@/contexts/ExpulsionProposals/types";
import type React from "react";
import { FaCircleCheck, FaCircleMinus, FaCircleXmark } from "react-icons/fa6";

import { PiHashFill } from "react-icons/pi";

import TruncatedHash from "@/components/TruncatedHash";
import { useRosters } from "@/contexts/Rosters";
import { Polkicon } from "@w3ux/react-polkicon";
import { Button } from "flowbite-react";
import { ExpulsionProposalStatus } from "./ExpulsionProposalsList";

import clsx from "clsx";
import ExpulsionProposalDetailsConfigValues from "./ExpulsionProposalDetailsConfigValues/ExpulsionProposalDetailsConfigValues";
import ExpulsionProposalDetailsVotes from "./ExpulsionProposalDetailsVotes";

interface ExpulsionProposalDetailsProps {
  proposal: ExpulsionProposal;
}

const ExpulsionProposalDetails: React.FC<ExpulsionProposalDetailsProps> = ({ proposal }) => {
  const { getRoster } = useRosters();
  const roster = getRoster(proposal.roster);

  if (!roster) {
    return null;
  }

  const infoList = [
    {
      term: "Motioner",
      detail: (
        <>
          <Polkicon address={proposal.motioner} transform="grow-5" background="none" />
          <TruncatedHash hash={proposal.motioner} />
        </>
      ),
    },
    {
      term: "Subject",
      detail: (
        <>
          <Polkicon address={proposal.subject} transform="grow-5" background="none" />
          <TruncatedHash hash={proposal.subject} />
        </>
      ),
    },
    {
      term: "Seconds",
      detail: proposal.seconds.map((second) => (
        <div key={second}>
          <Polkicon address={second} transform="grow-10" background="none" />
        </div>
      )),
    },
    {
      term: "Current Status",
      detail: (
        <span className="flex-none">
          <ExpulsionProposalStatus proposal={proposal} />
        </span>
      ),
    },
    {
      term: "Justification for proposed expulsion",
      detail: proposal.reason.asText(),
      extraWide: true,
    },
  ];

  return (
    <section className="mt-4 px-6 text-slate-700 dark:text-slate-300">
      <div className="px-4 sm:px-0">
        <h3 className="font-semibold text-base/7 text-gray-900 dark:text-slate-100">
          Proposal for expulsion from <span className="italic">{roster.title.asText()}</span>
        </h3>
        <p className="mt-1 flex max-w-2xl items-center gap-1 text-gray-500 text-sm/6 dark:text-slate-500">
          <PiHashFill />
          {roster.id.asHex()}
        </p>
      </div>
      <div className="mt-6">
        <ExpulsionProposalDetailsInfoList items={infoList} />
      </div>
      <ExpulsionProposalDetailsConfigValues proposal={proposal} />
    </section>
  );
};

interface ExpulsionProposalDetailsInfoListItemProps {
  term: React.ReactNode;
  detail: React.ReactNode;
  extraWide?: boolean;
}

const ExpulsionProposalDetailsInfoListItem: React.FC<ExpulsionProposalDetailsInfoListItemProps> = ({
  term,
  detail,
  extraWide,
}) => {
  return (
    <div
      className={clsx(
        "border-gray-200 border-t px-4 py-6 sm:col-span-1 sm:px-0 dark:border-slate-600",
        {
          "sm:col-span-2": extraWide,
        },
      )}
    >
      <dt className="font-medium text-gray-900 text-sm/6 dark:text-slate-100">{term}</dt>
      <dd className="mt-2 flex items-center gap-2 text-gray-700 text-sm/6 dark:text-slate-300">
        {detail}
      </dd>
    </div>
  );
};

const ExpulsionProposalDetailsInfoList: React.FC<{
  items: ExpulsionProposalDetailsInfoListItemProps[];
}> = ({ items }) => {
  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2">
      {items.map((item, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: there is no other unique key for this item
        <ExpulsionProposalDetailsInfoListItem key={index} {...item} />
      ))}
    </dl>
  );
};

export default ExpulsionProposalDetails;
