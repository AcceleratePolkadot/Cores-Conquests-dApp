import type React from "react";
import { useEffect, useState } from "react";

import { useLazyLoadQuery } from "@reactive-dot/react";
import { Polkicon } from "@w3ux/react-polkicon";
import { Card, Table as FlowbiteTable, Tooltip } from "flowbite-react";

import { useNominations } from "@/contexts/Nominations";
import type { Nomination } from "@/contexts/Nominations/types";
import { useRosters } from "@/contexts/Rosters";

import NominationVote from "@/components/NominationVote";
import PeriodProgress from "@/components/PeriodProgress";
import SearchFilters from "@/components/SearchFilters";
import Table from "@/components/Table";
import TruncatedHash from "@/components/TruncatedHash";

const NominationsList: React.FC = () => {
  const { activeRoster } = useRosters();
  const { toRoster } = useNominations();
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [filteredNominations, setFilteredNominations] = useState<Nomination[]>([]);
  const [currentItems, setCurrentItems] = useState<Nomination[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");

  const [nominationVotingPeriod, currentBlock] = useLazyLoadQuery((builder) =>
    builder.getConstant("Roster", "NominationVotingPeriod").readStorage("System", "Number", []),
  );

  useEffect(() => {
    if (activeRoster) {
      setNominations(toRoster(activeRoster.id));
    }
  }, [activeRoster, toRoster]);

  useEffect(() => {
    let _filteredNominations = nominations;

    if (searchValue !== "") {
      _filteredNominations = nominations.filter(
        (nomination) =>
          nomination.nominee.includes(searchValue) || nomination.nominator.includes(searchValue),
      );
    }

    setFilteredNominations(_filteredNominations);
  }, [nominations, searchValue]);

  const clearFilters = () => {
    setSearchValue("");
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
                      Current Nominations
                    </h5>
                  </div>
                </div>
                <SearchFilters
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  clearFilters={clearFilters}
                />
              </div>

              <Table<Nomination>
                paginateItems={filteredNominations}
                setCurrentItems={setCurrentItems}
              >
                <Table.Head>
                  <FlowbiteTable.HeadCell>Nominator</FlowbiteTable.HeadCell>
                  <FlowbiteTable.HeadCell>Nominee</FlowbiteTable.HeadCell>
                  <FlowbiteTable.HeadCell>Ayes</FlowbiteTable.HeadCell>
                  <FlowbiteTable.HeadCell>Nays</FlowbiteTable.HeadCell>
                  <FlowbiteTable.HeadCell>Progress</FlowbiteTable.HeadCell>
                  <FlowbiteTable.HeadCell>Status</FlowbiteTable.HeadCell>
                  <FlowbiteTable.HeadCell>
                    <span className="sr-only">Actions</span>
                  </FlowbiteTable.HeadCell>
                </Table.Head>

                <Table.Body>
                  {currentItems.map((nomination) => (
                    <FlowbiteTable.Row key={`${nomination.nominator}-${nomination.nominee}`}>
                      <FlowbiteTable.Cell className="items-center space-x-2">
                        <Polkicon address={nomination.nominator} transform="grow-2" />
                        <TruncatedHash hash={nomination.nominator} />
                      </FlowbiteTable.Cell>
                      <FlowbiteTable.Cell className="items-center space-x-2">
                        <Polkicon address={nomination.nominee} transform="grow-2" />
                        <TruncatedHash hash={nomination.nominee} />
                      </FlowbiteTable.Cell>
                      <FlowbiteTable.Cell>
                        <Tooltip
                          content={
                            nomination.votes.filter((vote) => vote.vote.type === "Aye").length
                          }
                        >
                          {nomination.votes
                            .filter((vote) => vote.vote.type === "Aye")
                            .map((vote) => (
                              <div key={vote.voter}>
                                <Polkicon
                                  address={vote.voter}
                                  transform="grow-10"
                                  background="none"
                                />
                              </div>
                            ))}
                        </Tooltip>
                      </FlowbiteTable.Cell>
                      <FlowbiteTable.Cell>
                        <Tooltip
                          content={
                            nomination.votes.filter((vote) => vote.vote.type === "Nay").length
                          }
                        >
                          {nomination.votes
                            .filter((vote) => vote.vote.type === "Nay")
                            .map((vote) => (
                              <div key={vote.voter}>
                                <Polkicon
                                  address={vote.voter}
                                  transform="grow-10"
                                  background="none"
                                />
                              </div>
                            ))}
                        </Tooltip>
                      </FlowbiteTable.Cell>
                      <FlowbiteTable.Cell>
                        <PeriodProgress
                          periodStart={nomination.nominated_on}
                          periodDuration={nominationVotingPeriod}
                          currentBlock={currentBlock}
                          theme={{
                            base: "w-full overflow-hidden bg-gray-100/60 dark:bg-gray-100/10 rounded-full",
                            label:
                              "mx-2 mb-1 flex justify-between space-x-2 text-xxs text-gray-600 dark:text-gray-300 uppercase",
                          }}
                          color={(period) =>
                            period.percentPassed <= 50
                              ? "lime"
                              : period.percentPassed <= 75
                                ? "yellow"
                                : period.percentPassed === 100
                                  ? "gray"
                                  : "red"
                          }
                          labelText
                          labelProgress={({ percentPassed }) => percentPassed !== 100}
                          textLabel={({ percentPassed }) =>
                            percentPassed === 100 ? "voting has ended" : "period passed:"
                          }
                          textLabelPosition="outside"
                          progressLabelPosition="outside"
                        />
                      </FlowbiteTable.Cell>
                      <FlowbiteTable.Cell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs ${
                            nomination.status.type === "Approved"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          }`}
                        >
                          {nomination.status.type}
                        </span>
                      </FlowbiteTable.Cell>
                      <FlowbiteTable.Cell>
                        <NominationVote nomination={nomination} />
                      </FlowbiteTable.Cell>
                    </FlowbiteTable.Row>
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

export default NominationsList;
