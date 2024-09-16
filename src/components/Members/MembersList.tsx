"use client";

import SearchFilters from "@/components/SearchFilters";
import Table from "@/components/Table";
import TruncatedHash from "@/components/TruncatedHash";
import { Polkicon } from "@/components/identicons";
import { useAccounts } from "@/contexts/Accounts";
import { useNominations } from "@/contexts/Nominations";
import { useRosters } from "@/contexts/Rosters";
import { Card, Table as FlowbiteTable } from "flowbite-react";
import type React from "react";
import { useEffect, useState } from "react";
import { FaTrashCan } from "react-icons/fa6";

import type { Member } from "./types";

const MembersList: React.FC = () => {
  const { activeRoster } = useRosters();
  const { getAccount } = useAccounts();
  const { byNominator } = useNominations();
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilterMembers] = useState<Member[]>([]);
  const [currentItems, setCurrentItems] = useState<Member[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    if (activeRoster) {
      setMembers(
        activeRoster.members.map((id) => getAccount(id)).filter((account) => account !== undefined),
      );
    } else {
      setMembers([]);
    }
  }, [activeRoster, getAccount]);

  useEffect(() => {
    let _filteredMembers = members;

    if (searchValue !== "") {
      const foundViaAddress = _filteredMembers.filter((member) =>
        member.address.includes(searchValue),
      );
      const foundViaNominating = _filteredMembers.filter((member) =>
        byNominator(member.address).some((nomination) => nomination.nominee === searchValue),
      );
      _filteredMembers = [...new Set([...foundViaAddress, ...foundViaNominating])];
    }

    setFilterMembers(_filteredMembers);
  }, [members, searchValue, byNominator]);

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
                      Current Members
                    </h5>
                  </div>
                </div>
                <SearchFilters
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  clearFilters={clearFilters}
                />
              </div>

              <Table<Member> paginateItems={filteredMembers} setCurrentItems={setCurrentItems}>
                <Table.Head>
                  <FlowbiteTable.HeadCell>Account Id</FlowbiteTable.HeadCell>
                  <FlowbiteTable.HeadCell>Nominating</FlowbiteTable.HeadCell>
                  <FlowbiteTable.HeadCell>
                    <span className="sr-only">Actions</span>
                  </FlowbiteTable.HeadCell>
                </Table.Head>

                <Table.Body>
                  {currentItems.map((member) => (
                    <FlowbiteTable.Row key={member.address}>
                      <th scope="row" className="max-w-28 overflow-hidden text-ellipsis">
                        <TruncatedHash hash={member.address} />
                      </th>
                      <FlowbiteTable.Cell>
                        <div className="-space-x-2 flex">
                          {byNominator(member.address).map((nomination) => (
                            <div
                              key={nomination.nominee}
                              className="h-6 w-6 rounded-full bg-gray-50 ring-2 ring-white dark:bg-gray-600 dark:ring-gray-400"
                            >
                              <Polkicon address={nomination.nominee} size={24} copy={true} />
                            </div>
                          ))}
                        </div>
                      </FlowbiteTable.Cell>
                      <FlowbiteTable.Cell>
                        <FaTrashCan />
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

export default MembersList;