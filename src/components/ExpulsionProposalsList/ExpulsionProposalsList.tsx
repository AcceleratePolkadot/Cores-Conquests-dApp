import type React from "react";
import { Fragment, useEffect, useState } from "react";

import { useLazyLoadQuery } from "@reactive-dot/react";
import { Polkicon } from "@w3ux/react-polkicon";
import clsx from "clsx";
import { Button, Card, Table as FlowbiteTable, Tooltip } from "flowbite-react";

import { FaChevronDown, FaChevronUp } from "react-icons/fa";

import { useExpulsionProposals } from "@/contexts/ExpulsionProposals";
import type { ExpulsionProposal } from "@/contexts/ExpulsionProposals/types";
import { useRosters } from "@/contexts/Rosters";

import PeriodProgress, { calculateProgress, type Periods } from "@/components/PeriodProgress";
import SearchFilters from "@/components/SearchFilters";
import Table from "@/components/Table";
import TruncatedHash from "@/components/TruncatedHash";
import ExpulsionProposalStatusTimeline from "./ExpulsionProposalStatusTimeline";

import { slugify } from "@/utils/typography";

import ExpulsionProposalDetails from "@/components/ExpulsionProposalsList/ExpulsionProposalDetails";
import type { ExpulsionProposalStatusProps } from "./types";

export const ExpulsionProposalStatus: React.FC<ExpulsionProposalStatusProps> = ({ proposal }) => {
  const baseStyles = "p-2 text-xxs uppercase font-semibold rounded-full";

  switch (proposal.status.type) {
    case "Proposed":
      return (
        <span
          className={clsx(
            baseStyles,
            "bg-sky-100 text-slate-600 dark:bg-sky-900 dark:text-sky-300",
          )}
        >
          {proposal.status.type}
        </span>
      );
    case "Seconded":
      return (
        <span
          className={clsx(
            baseStyles,
            "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
          )}
        >
          {proposal.status.type}
        </span>
      );
    case "Passed":
      return (
        <span
          className={clsx(
            baseStyles,
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
          )}
        >
          {proposal.status.type}
        </span>
      );
    case "Dismissed":
    case "DismissedWithPrejudice":
      return (
        <span
          className={clsx(baseStyles, "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300")}
        >
          {proposal.status.type}
        </span>
      );
    case "Voting": {
      return (
        <span
          className={clsx(
            baseStyles,
            "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
          )}
        >
          Deciding
        </span>
      );
    }
  }
};

const ExpulsionProposalsList: React.FC = () => {
  const { activeRoster } = useRosters();
  const { forRoster } = useExpulsionProposals();
  const [proposals, setProposals] = useState<ExpulsionProposal[]>([]);
  const [filteredProposals, setFilteredProposals] = useState<ExpulsionProposal[]>([]);
  const [currentItems, setCurrentItems] = useState<ExpulsionProposal[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [expandedRow, setExpandedRow] = useState<string | undefined>(undefined);

  const [expulsionVotingPeriod, currentBlock] = useLazyLoadQuery((builder) =>
    builder
      .getConstant("Roster", "ExpulsionProposalVotingPeriod")
      .readStorage("System", "Number", []),
  );

  useEffect(() => {
    if (activeRoster) {
      setProposals(forRoster(activeRoster.id));
    }
  }, [activeRoster, forRoster]);

  useEffect(() => {
    let _filteredProposals = proposals;

    if (searchValue !== "") {
      _filteredProposals = proposals.filter(
        (proposal) =>
          proposal.subject.includes(searchValue) ||
          proposal.motioner.includes(searchValue) ||
          proposal.seconds.some((second) => second.includes(searchValue)),
      );
    }

    setFilteredProposals(_filteredProposals);
  }, [proposals, searchValue]);

  const clearFilters = () => {
    setSearchValue("");
  };

  const id = (proposal: ExpulsionProposal) => {
    return slugify([
      proposal.motioner,
      proposal.subject,
      proposal.roster.asHex(),
      proposal.proposed_on.toString(),
    ]);
  };

  return (
    activeRoster && (
      <Card>
        <section>
          <div>
            <div className="relative overflow-hidden">
              <div className="w-full border-b dark:border-gray-700">
                <div className="flex items-center justify-between space-x-4 pt-3">
                  <div className="flex flex-1 items-center space-x-3">
                    <h5 className="mb-2 font-bold text-3xl text-gray-900 dark:text-white">
                      Active Expulsion Proposals
                    </h5>
                  </div>
                </div>
                <SearchFilters
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  clearFilters={clearFilters}
                />
              </div>

              <Table<ExpulsionProposal>
                paginateItems={filteredProposals}
                setCurrentItems={setCurrentItems}
                striped
                hoverable
              >
                <Table.Head>
                  <FlowbiteTable.HeadCell>
                    <span className="sr-only">Expand</span>
                  </FlowbiteTable.HeadCell>
                  <FlowbiteTable.HeadCell>Motioner</FlowbiteTable.HeadCell>
                  <FlowbiteTable.HeadCell>Subject</FlowbiteTable.HeadCell>
                  <FlowbiteTable.HeadCell>Seconds</FlowbiteTable.HeadCell>
                  <FlowbiteTable.HeadCell>Ayes</FlowbiteTable.HeadCell>
                  <FlowbiteTable.HeadCell>Nays</FlowbiteTable.HeadCell>
                  <FlowbiteTable.HeadCell>Abstains</FlowbiteTable.HeadCell>
                  <FlowbiteTable.HeadCell>Status</FlowbiteTable.HeadCell>
                  <FlowbiteTable.HeadCell>
                    <span className="sr-only">Actions</span>
                  </FlowbiteTable.HeadCell>
                </Table.Head>

                <Table.Body>
                  {currentItems.map((proposal) => (
                    <Fragment key={id(proposal)}>
                      <FlowbiteTable.Row
                        className={clsx({
                          "!bg-stone-100 dark:!bg-slate-500/50": expandedRow === id(proposal),
                        })}
                      >
                        <FlowbiteTable.Cell>
                          <Button
                            outline
                            color="light"
                            onClick={() => {
                              if (expandedRow === id(proposal)) {
                                setExpandedRow(undefined);
                              } else {
                                setExpandedRow(id(proposal));
                              }
                            }}
                            className="!bg-transparent [&>span]:!bg-transparent border-none focus:ring-0"
                          >
                            {expandedRow === id(proposal) ? (
                              <FaChevronUp className="text-black dark:text-white" />
                            ) : (
                              <FaChevronDown className="text-slate-400 dark:text-slate-300" />
                            )}
                          </Button>
                        </FlowbiteTable.Cell>
                        <FlowbiteTable.Cell className="items-center space-x-2">
                          <Polkicon address={proposal.motioner} transform="grow-2" />
                          <TruncatedHash hash={proposal.motioner} />
                        </FlowbiteTable.Cell>
                        <FlowbiteTable.Cell className="items-center space-x-2">
                          <Polkicon address={proposal.subject} transform="grow-2" />
                          <TruncatedHash hash={proposal.subject} />
                        </FlowbiteTable.Cell>
                        <FlowbiteTable.Cell>{proposal.seconds.length}</FlowbiteTable.Cell>
                        <FlowbiteTable.Cell>
                          {proposal.votes.filter((vote) => vote.vote.type === "Aye").length}
                        </FlowbiteTable.Cell>
                        <FlowbiteTable.Cell>
                          {proposal.votes.filter((vote) => vote.vote.type === "Nay").length}
                        </FlowbiteTable.Cell>
                        <FlowbiteTable.Cell>
                          {proposal.votes.filter((vote) => vote.vote.type === "Abstain").length}
                        </FlowbiteTable.Cell>
                        <FlowbiteTable.Cell>
                          <ExpulsionProposalStatus proposal={proposal} />
                        </FlowbiteTable.Cell>
                        <FlowbiteTable.Cell>...</FlowbiteTable.Cell>
                      </FlowbiteTable.Row>
                      <FlowbiteTable.Row>
                        <FlowbiteTable.Cell
                          colSpan={9}
                          className={clsx(
                            "!bg-gray-50 dark:!bg-gray-700 border-white border-b dark:border-gray-700",
                            {
                              hidden: expandedRow !== id(proposal),
                            },
                          )}
                        >
                          <ExpulsionProposalStatusTimeline proposal={proposal} />
                          <ExpulsionProposalDetails proposal={proposal} />
                        </FlowbiteTable.Cell>
                      </FlowbiteTable.Row>
                    </Fragment>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </div>
        </section>
      </Card>
    )
  );
};

export default ExpulsionProposalsList;
