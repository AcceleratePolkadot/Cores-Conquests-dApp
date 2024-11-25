import SearchFilters from "@/components/SearchFilters";
import Table from "@/components/Table";
import TruncatedHash from "@/components/TruncatedHash";
import type { Address } from "@/contexts/ActiveAccount/types";
import { useNominations } from "@/contexts/Nominations";
import { useRosters } from "@/contexts/Rosters";
import useBalanceFormatter from "@/hooks/useBalanceFormatter";
import { useLazyLoadQuery } from "@reactive-dot/react";
import { Polkicon } from "@w3ux/react-polkicon";
import { BigNumber } from "bignumber.js";
import { Card, Table as FlowbiteTable } from "flowbite-react";
import type React from "react";
import { useEffect, useState } from "react";
import type { Member } from "./types";

const MembersList: React.FC = () => {
  const { activeRoster } = useRosters();
  const { byNominator } = useNominations();
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilterMembers] = useState<Member[]>([]);
  const [currentItems, setCurrentItems] = useState<Member[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    if (activeRoster) {
      setMembers(activeRoster.members);
    }
  }, [activeRoster]);

  useEffect(() => {
    let _filteredMembers = members;

    if (searchValue !== "") {
      const foundViaAddress = _filteredMembers.filter((member) => member.includes(searchValue));
      const foundViaNominating = _filteredMembers.filter((member) =>
        byNominator(member).some((nomination) => nomination.nominee === searchValue),
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
                  <FlowbiteTable.HeadCell>Free</FlowbiteTable.HeadCell>
                  <FlowbiteTable.HeadCell>Reserved</FlowbiteTable.HeadCell>
                  <FlowbiteTable.HeadCell>Total</FlowbiteTable.HeadCell>
                  <FlowbiteTable.HeadCell>Nominating</FlowbiteTable.HeadCell>
                  <FlowbiteTable.HeadCell>
                    <span className="sr-only">Actions</span>
                  </FlowbiteTable.HeadCell>
                </Table.Head>

                <Table.Body>
                  {currentItems.map((member) => (
                    <FlowbiteTable.Row key={member}>
                      <th scope="row" className="max-w-28 overflow-hidden text-ellipsis">
                        <TruncatedHash hash={member} />
                      </th>
                      <MemberBalanceCells address={member} />
                      <FlowbiteTable.Cell>
                        <div className="-space-x-2 flex">
                          {byNominator(member).map((nomination) => (
                            <div
                              key={nomination.nominee}
                              className="h-6 w-6 rounded-full bg-gray-50 ring-2 ring-white dark:bg-gray-600 dark:ring-gray-400"
                            >
                              <Polkicon address={nomination.nominee} />
                            </div>
                          ))}
                        </div>
                      </FlowbiteTable.Cell>
                      <FlowbiteTable.Cell>...</FlowbiteTable.Cell>
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

const MemberBalanceCells: React.FC<{ address: Address }> = ({ address }) => {
  const { balanceFormatter } = useBalanceFormatter();
  const systemAccount = useLazyLoadQuery((builder) =>
    builder.readStorage("System", "Account", [address]),
  );

  return systemAccount ? (
    <>
      <FlowbiteTable.Cell>
        {balanceFormatter(BigNumber(systemAccount.data.free.toString()))}
      </FlowbiteTable.Cell>
      <FlowbiteTable.Cell>
        {balanceFormatter(BigNumber(systemAccount.data.reserved.toString()))}
      </FlowbiteTable.Cell>
      <FlowbiteTable.Cell>
        {balanceFormatter(
          BigNumber((systemAccount.data.free + systemAccount.data.reserved).toString()),
        )}
      </FlowbiteTable.Cell>
    </>
  ) : (
    <>
      <FlowbiteTable.Cell>-</FlowbiteTable.Cell>
      <FlowbiteTable.Cell>-</FlowbiteTable.Cell>
      <FlowbiteTable.Cell>-</FlowbiteTable.Cell>
    </>
  );
};

export default MembersList;
