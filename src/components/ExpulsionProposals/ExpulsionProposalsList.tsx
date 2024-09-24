import { calculateProgress } from "@/components/PeriodProgress/utils";
import SearchFilters from "@/components/SearchFilters";
import Table from "@/components/Table";
import { Polkicon } from "@/components/identicons";
import { useBlocks } from "@/contexts/Blocks";
import { useExpulsionProposals } from "@/contexts/ExpulsionProposals";
import type { ExpulsionProposal } from "@/contexts/ExpulsionProposals/types";
import { usePalletsConstants } from "@/contexts/PalletsConstants";
import { useRosters } from "@/contexts/Rosters";
import { ActivityRings } from "@jonasdoesthings/react-activity-rings";
import { ResponsiveBar } from "@nivo/bar";
import { Card, Table as FlowbiteTable } from "flowbite-react";
import type React from "react";
import { useEffect, useState } from "react";
import { FaEllipsisVertical } from "react-icons/fa6";

const ExpulsionProposalsList: React.FC = () => {
  const { activeRoster } = useRosters();
  const { currentBlock } = useBlocks();
  const { forRoster } = useExpulsionProposals();
  const { palletsConstants } = usePalletsConstants();
  const rosterConstants = palletsConstants.Roster ?? {};
  const [expulsionProposals, setExpulsionProposals] = useState<ExpulsionProposal[]>([]);
  const [filteredExpulsionProposals, setFilterExpulsionProposals] = useState<ExpulsionProposal[]>(
    [],
  );
  const [currentItems, setCurrentItems] = useState<ExpulsionProposal[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    if (activeRoster) {
      const proposalsForRoster = forRoster(activeRoster.id);
      setExpulsionProposals(proposalsForRoster);
    } else {
      setExpulsionProposals([]);
    }
  }, [activeRoster, forRoster]);

  useEffect(() => {
    const _filteredNominations =
      searchValue !== ""
        ? expulsionProposals.filter(
            (proposal) =>
              proposal.motioner.includes(searchValue) ||
              proposal.subject.includes(searchValue) ||
              proposal.seconds.some((second) => second.includes(searchValue)),
          )
        : expulsionProposals;

    setFilterExpulsionProposals(_filteredNominations);
  }, [expulsionProposals, searchValue]);

  const clearFilters = () => {
    setSearchValue("");
  };

  const progressTooltipContent = (progress: number, proposal: ExpulsionProposal) => {
    const tense = progress === 100 ? "ed" : "ing";
    const ayes = proposal.votes.filter((vote) => vote.vote.type === "Aye").length;
    const nays = proposal.votes.length - ayes;

    return `vote ${ayes > nays ? "pass" : "fail"}${tense} - ${ayes} to ${nays}`;
  };

  return (
    activeRoster && (
      <Card className="overflow-hidden">
        <section>
          <div>
            <div className="relative overflow-hidden">
              <div className="w-full border-b dark:border-gray-700">
                <div className="flex items-center justify-between space-x-4 pt-3">
                  <div className="flex flex-1 items-center space-x-3">
                    <h5 className="mb-2 font-bold text-3xl text-gray-900 dark:text-white">
                      Current Expulsion Proposals
                    </h5>
                  </div>
                </div>
                {expulsionProposals.length > 0 && (
                  <SearchFilters
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    clearFilters={clearFilters}
                  />
                )}
              </div>

              {expulsionProposals.length > 0 ? (
                <Table<ExpulsionProposal>
                  paginateItems={filteredExpulsionProposals}
                  setCurrentItems={setCurrentItems}
                >
                  <Table.Head>
                    <FlowbiteTable.HeadCell>Motioner</FlowbiteTable.HeadCell>
                    <FlowbiteTable.HeadCell>Subject</FlowbiteTable.HeadCell>
                    <FlowbiteTable.HeadCell>Seconds</FlowbiteTable.HeadCell>
                    <FlowbiteTable.HeadCell>Reason</FlowbiteTable.HeadCell>
                    <FlowbiteTable.HeadCell>Ayes</FlowbiteTable.HeadCell>
                    <FlowbiteTable.HeadCell>Nays</FlowbiteTable.HeadCell>
                    <FlowbiteTable.HeadCell>Abstains</FlowbiteTable.HeadCell>
                    <FlowbiteTable.HeadCell>Votes</FlowbiteTable.HeadCell>
                    <FlowbiteTable.HeadCell className="text-center">
                      Progress
                    </FlowbiteTable.HeadCell>
                    <FlowbiteTable.HeadCell>
                      <span className="sr-only">Actions</span>
                    </FlowbiteTable.HeadCell>
                  </Table.Head>

                  <Table.Body>
                    {currentItems.map((proposal) => (
                      <FlowbiteTable.Row key={proposal.motioner}>
                        <th scope="row" className="max-w-28 overflow-hidden text-ellipsis">
                          <Polkicon address={proposal.motioner} size={24} copy={true} />
                        </th>
                        <FlowbiteTable.Cell>
                          <Polkicon address={proposal.subject} size={24} copy={true} />
                        </FlowbiteTable.Cell>
                        <FlowbiteTable.Cell>
                          <div className="-space-x-2 flex">
                            {proposal.seconds.map((seconder) => (
                              <div
                                key={seconder}
                                className="h-6 w-6 rounded-full bg-gray-50 ring-2 ring-white dark:bg-gray-600 dark:ring-gray-400"
                              >
                                <Polkicon address={seconder} size={24} copy={true} />
                              </div>
                            ))}
                          </div>
                        </FlowbiteTable.Cell>
                        <FlowbiteTable.Cell className="max-w-80">
                          {proposal.reason.asText()}
                        </FlowbiteTable.Cell>
                        <FlowbiteTable.Cell>
                          <div className="-space-x-2 flex">
                            {proposal.votes
                              .filter((vote) => vote.vote.type === "Aye")
                              .map((vote) => (
                                <div
                                  key={vote.voter}
                                  className="h-6 w-6 rounded-full bg-gray-50 ring-2 ring-white dark:bg-gray-600 dark:ring-gray-400"
                                >
                                  <Polkicon address={vote.voter} size={24} copy={true} />
                                </div>
                              ))}
                          </div>
                        </FlowbiteTable.Cell>
                        <FlowbiteTable.Cell>
                          <div className="-space-x-2 flex">
                            {proposal.votes
                              .filter((vote) => vote.vote.type === "Nay")
                              .map((vote) => (
                                <div
                                  key={vote.voter}
                                  className="h-6 w-6 rounded-full bg-gray-50 ring-2 ring-white dark:bg-gray-600 dark:ring-gray-400"
                                >
                                  <Polkicon address={vote.voter} size={24} copy={true} />
                                </div>
                              ))}
                          </div>
                        </FlowbiteTable.Cell>
                        <FlowbiteTable.Cell>
                          <div className="-space-x-2 flex">
                            {proposal.votes
                              .filter((vote) => vote.vote.type === "Abstain")
                              .map((vote) => (
                                <div
                                  key={vote.voter}
                                  className="h-6 w-6 rounded-full bg-gray-50 ring-2 ring-white dark:bg-gray-600 dark:ring-gray-400"
                                >
                                  <Polkicon address={vote.voter} size={24} copy={true} />
                                </div>
                              ))}
                          </div>
                        </FlowbiteTable.Cell>
                        <FlowbiteTable.Cell>
                          <VotesBarChart proposal={proposal} />
                        </FlowbiteTable.Cell>

                        <FlowbiteTable.Cell className="h-24">
                          <ProgressCircles proposal={proposal} />
                        </FlowbiteTable.Cell>

                        <FlowbiteTable.Cell>
                          <FaEllipsisVertical />
                        </FlowbiteTable.Cell>
                      </FlowbiteTable.Row>
                    ))}
                  </Table.Body>
                </Table>
              ) : (
                <div className="p-20 text-justify">
                  <h3 className="text-center font-bold text-gray-300 text-sm dark:text-gray-600">
                    No expulsion proposals found
                  </h3>
                </div>
              )}
            </div>
          </div>
        </section>
      </Card>
    )
  );
};

const VotesBarChart: React.FC<{ proposal: ExpulsionProposal }> = ({ proposal }) => {
  const { activeRoster } = useRosters();

  if (!activeRoster || activeRoster.id.asHex() !== proposal.roster.asHex()) {
    return null;
  }

  const ayes = proposal.votes.filter((vote) => vote.vote.type === "Aye").length;
  const nays = proposal.votes.filter((vote) => vote.vote.type === "Nay").length;
  const abstains = proposal.votes.filter((vote) => vote.vote.type === "Abstain").length;
  const nots = activeRoster.members.length - ayes - nays - abstains;

  const chartData = [
    {
      "Aye votes": ayes,
      "Nay votes": nays,
      Abstains: abstains,
      "Not voted": nots,
    },
  ];

  return (
    <div className="h-4 max-w-32">
      <ResponsiveBar
        data={chartData}
        keys={["Aye votes", "Nay votes", "Abstains", "Not voted"]}
        indexBy="id"
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        layout="horizontal"
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={{ scheme: "nivo" }}
        borderColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        animate={false}
        axisTop={null}
        axisRight={null}
        axisBottom={null}
        axisLeft={null}
        enableGridY={false}
        enableTotals={false}
        enableLabel={false}
        tooltipLabel={(data) => data.id.toString()}
        legends={[]}
        motionConfig="wobbly"
        role="application"
        ariaLabel="Expulsion proposal votes"
      />
    </div>
  );
};

const ProgressCircles: React.FC<{ proposal: ExpulsionProposal }> = ({ proposal }) => {
  const { currentBlock } = useBlocks();
  const { palletsConstants } = usePalletsConstants();
  const rosterConstants = palletsConstants.Roster ?? {};

  const circles = [];

  if (
    "ExpulsionProposalAwaitingSecondPeriod" in rosterConstants &&
    rosterConstants.ExpulsionProposalAwaitingSecondPeriod
  ) {
    if (proposal.status.type === "Proposed" || proposal.status.type === "Seconded") {
      const secondPeriod = calculateProgress({
        periodStart: proposal.proposed_on,
        periodDuration: rosterConstants.ExpulsionProposalAwaitingSecondPeriod,
        currentBlock,
      });

      circles.push({
        filledPercentage: secondPeriod.percentPassed / 100,
        color: "#f4a261",
      });
    } else {
      circles.push({
        filledPercentage: 1,
        color: "#6d6875",
      });
    }
  }

  if (
    "ExpulsionProposalVotingPeriod" in rosterConstants &&
    rosterConstants.ExpulsionProposalVotingPeriod
  ) {
    if (proposal.status.type === "Voting") {
      const votingPeriod = calculateProgress({
        periodStart: proposal.voting_opened_on as number,
        periodDuration: rosterConstants.ExpulsionProposalVotingPeriod,
        currentBlock,
      });

      circles.push({
        filledPercentage: votingPeriod.percentPassed / 100,
        color: "#83c5be",
      });
    } else if (proposal.status.type === "Proposed" || proposal.status.type === "Seconded") {
      circles.push({
        filledPercentage: 0,
        color: "#6d6875",
      });
    } else {
      circles.push({
        filledPercentage: 1,
        color: "#6d6875",
      });
    }
  }

  return (
    <div className="h-24">
      <ActivityRings rings={circles} />
    </div>
  );
};

export default ExpulsionProposalsList;
