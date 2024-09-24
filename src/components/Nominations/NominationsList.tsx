import PeriodProgress from "@/components/PeriodProgress";
import SearchFilters from "@/components/SearchFilters";
import Table from "@/components/Table";
import TruncatedHash from "@/components/TruncatedHash";
import { Polkicon } from "@/components/identicons";
import { useBlocks } from "@/contexts/Blocks";
import { useNominations } from "@/contexts/Nominations";
import type { Nomination } from "@/contexts/Nominations/types";
import { usePalletsConstants } from "@/contexts/PalletsConstants";
import { useRosters } from "@/contexts/Rosters";
import { Card, Table as FlowbiteTable } from "flowbite-react";
import type React from "react";
import { useEffect, useState } from "react";
import { MdOutlineHowToVote } from "react-icons/md";

const NominationsList: React.FC = () => {
  const { activeRoster } = useRosters();
  const { currentBlock } = useBlocks();
  const { toRoster } = useNominations();
  const { palletsConstants } = usePalletsConstants();
  const rosterConstants = palletsConstants.Roster ?? {};
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [filteredNominations, setFilterNominations] = useState<Nomination[]>([]);
  const [currentItems, setCurrentItems] = useState<Nomination[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    if (activeRoster) {
      const nominatedToRoster = toRoster(activeRoster.id);
      setNominations(nominatedToRoster);
    } else {
      setNominations([]);
    }
  }, [activeRoster, toRoster]);

  useEffect(() => {
    const _filteredNominations =
      searchValue !== ""
        ? nominations.filter(
            (nomination) =>
              nomination.nominee.includes(searchValue) ||
              nomination.nominator.includes(searchValue),
          )
        : nominations;

    setFilterNominations(_filteredNominations);
  }, [nominations, searchValue]);

  const clearFilters = () => {
    setSearchValue("");
  };

  const progressTooltipContent = (progress: number, nomination: Nomination) => {
    const tense = progress === 100 ? "ed" : "ing";
    const ayes = nomination.votes.filter((vote) => vote.vote.type === "Aye").length;
    const nays = nomination.votes.length - ayes;

    return `vote ${ayes > nays ? "pass" : "fail"}${tense} - ${ayes} to ${nays}`;
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
                {nominations.length > 0 && (
                  <SearchFilters
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    clearFilters={clearFilters}
                  />
                )}
              </div>

              {nominations.length > 0 ? (
                <Table<Nomination>
                  paginateItems={filteredNominations}
                  setCurrentItems={setCurrentItems}
                >
                  <Table.Head>
                    <FlowbiteTable.HeadCell>Nominee</FlowbiteTable.HeadCell>
                    <FlowbiteTable.HeadCell>Nominator</FlowbiteTable.HeadCell>
                    <FlowbiteTable.HeadCell>Nominated On</FlowbiteTable.HeadCell>
                    <FlowbiteTable.HeadCell>Ayes</FlowbiteTable.HeadCell>
                    <FlowbiteTable.HeadCell>Nays</FlowbiteTable.HeadCell>
                    <FlowbiteTable.HeadCell>Progress</FlowbiteTable.HeadCell>
                    <FlowbiteTable.HeadCell>
                      <span className="sr-only">Actions</span>
                    </FlowbiteTable.HeadCell>
                  </Table.Head>

                  <Table.Body>
                    {currentItems
                      .sort((a, b) => a.nominated_on - b.nominated_on)
                      .map((nomination) => (
                        <FlowbiteTable.Row key={nomination.nominee}>
                          <th scope="row" className="max-w-28 overflow-hidden text-ellipsis">
                            <TruncatedHash hash={nomination.nominee} />
                          </th>
                          <FlowbiteTable.Cell>
                            <TruncatedHash hash={nomination.nominator} />
                          </FlowbiteTable.Cell>
                          <FlowbiteTable.Cell>{nomination.nominated_on}</FlowbiteTable.Cell>
                          <FlowbiteTable.Cell>
                            <div className="-space-x-2 flex">
                              {nomination.votes
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
                              {nomination.votes
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
                            {"NominationVotingPeriod" in rosterConstants && (
                              <PeriodProgress
                                periodStart={nomination.nominated_on}
                                periodDuration={rosterConstants.NominationVotingPeriod as number}
                                currentBlock={currentBlock}
                                theme={{
                                  base: "w-full overflow-hidden",
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
                                customTooltip={({ percentPassed }) => (
                                  <>{progressTooltipContent(percentPassed, nomination)}</>
                                )}
                              />
                            )}
                          </FlowbiteTable.Cell>
                          <FlowbiteTable.Cell>
                            <MdOutlineHowToVote />
                          </FlowbiteTable.Cell>
                        </FlowbiteTable.Row>
                      ))}
                  </Table.Body>
                </Table>
              ) : (
                <div className="p-20 text-justify">
                  <h3 className="text-center font-bold text-gray-300 text-sm dark:text-gray-600">
                    No nominations found
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

export default NominationsList;
