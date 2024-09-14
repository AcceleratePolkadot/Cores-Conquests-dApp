import { Polkicon, Rosticon } from "@/components/identicons";
import { useAccounts } from "@/contexts/Accounts";
import type { Roster as BaseRoster } from "@/contexts/Rosters/types";
import { Button, Sidebar, Table } from "flowbite-react";
import type React from "react";
import { useEffect, useState } from "react";
import { HiChevronDown } from "react-icons/hi";
import { MdHorizontalRule } from "react-icons/md";

import { useNominations } from "@/contexts/Nominations";
import { useRosters } from "@/contexts/Rosters";

type RosterRelationship = "founder" | "member" | "approved_for" | "pending_for";

interface Roster extends BaseRoster {
  relationship: RosterRelationship;
}

const RostersList: React.FC = () => {
  const { foundedBy, memberOf, activeRoster, setActiveRoster, getRoster } = useRosters();
  const { activeAccount } = useAccounts();
  const { approvedForNominee, pendingForNominee } = useNominations();
  const [rosters, setRosters] = useState<Roster[]>([]);

  useEffect(() => {
    if (activeAccount) {
      const foundedRosters = foundedBy(activeAccount.address).map((roster) => ({
        ...roster,
        relationship: "founder" as RosterRelationship,
      }));

      const joinedRosters = memberOf(activeAccount.address)
        .filter((roster) => !foundedBy(activeAccount.address).includes(roster))
        .map((roster) => ({
          ...roster,
          relationship: "member" as RosterRelationship,
        }));

      const approvedForRosters = approvedForNominee(activeAccount.address)
        .map((nomination) => getRoster(nomination.roster))
        .filter((roster) => roster !== undefined)
        .map((roster) => ({
          ...roster,
          relationship: "approved_for" as RosterRelationship,
        }));

      const pendingForRosters = pendingForNominee(activeAccount.address)
        .map((nomination) => getRoster(nomination.roster))
        .filter((roster) => roster !== undefined)
        .map((roster) => ({
          ...roster,
          relationship: "pending_for" as RosterRelationship,
        }));

      setRosters([
        ...foundedRosters,
        ...joinedRosters,
        ...approvedForRosters,
        ...pendingForRosters,
      ]);
    } else {
      setRosters([]);
    }
  }, [activeAccount, foundedBy, memberOf, approvedForNominee, pendingForNominee, getRoster]);

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden shadow">
            <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <Table.Head className="bg-gray-100 dark:bg-gray-700">
                <Table.HeadCell>Title</Table.HeadCell>
                <Table.HeadCell>Membership Status</Table.HeadCell>
                <Table.HeadCell>Members</Table.HeadCell>
                <Table.HeadCell>Roster Status</Table.HeadCell>
                <Table.HeadCell>Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                {rosters.map((roster) => (
                  <Table.Row
                    key={roster.id.asHex()}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Table.Cell className="flex items-center space-x-6 whitespace-nowrap p-4 lg:mr-0">
                      <Rosticon rosterId={roster.id} className="h-10 w-10 rounded-full" />
                      <div className="font-normal text-gray-500 text-sm dark:text-gray-400">
                        <div className="font-semibold text-base text-gray-900 dark:text-white">
                          {roster.title.asText()}
                        </div>
                        <div className="font-normal text-gray-500 text-xs dark:text-gray-400">
                          {roster.id.asHex()}
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      {roster.relationship === "founder"
                        ? "Founder"
                        : roster.relationship === "member"
                          ? "Member"
                          : roster.relationship === "approved_for"
                            ? "Nomination Approved"
                            : "Nomination Pending"}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 font-medium text-base text-gray-900 dark:text-white">
                      <div className="-space-x-2 flex">
                        {roster.members.map((member) => (
                          <div
                            key={member}
                            className="h-6 w-6 rounded-full bg-gray-50 ring-2 ring-white dark:bg-gray-600 dark:ring-gray-400"
                          >
                            <Polkicon address={member} size={24} copy={true} />
                          </div>
                        ))}
                      </div>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 font-normal text-base text-gray-900 dark:text-white">
                      <div className="flex items-center">
                        {roster.status.type === "Active" ? (
                          <>
                            <div className="mr-2 h-2.5 w-2.5 rounded-full bg-green-400" /> Active
                          </>
                        ) : (
                          <>
                            <div className="mr-2 h-2.5 w-2.5 rounded-full bg-red-400" /> Inactive
                          </>
                        )}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center gap-x-3 whitespace-nowrap">
                        {roster.relationship === "approved_for" ? (
                          <Button type="button">Join</Button>
                        ) : (
                          <Button
                            type="button"
                            onClick={() => {
                              const newActiveRoster = getRoster(roster.id);
                              newActiveRoster && setActiveRoster(newActiveRoster);
                            }}
                          >
                            View
                          </Button>
                        )}
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );

  /* return (
    <ul className="divide-y divide-gray-100">
      {rosters.map((roster) => (
        <li
          key={roster.id.asHex()}
          className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-5"
        >
          <div>
            <p className="text-sm font-semibold leading-6 text-gray-900">{roster.title.asText()}</p>
            <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
              <p>
                founded by:{" "}
                {roster.founder === activeAccount?.address ? <strong>you</strong> : roster.founder}{" "}
                on block {roster.founded_on}
              </p>
              <svg role="presentation" viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                <circle r={1} cx={1} cy={1} />
              </svg>
              <p>status: {roster.status.type}</p>
            </div>
          </div>
          <div className="flex w-full flex-none justify-between gap-x-8 sm:w-auto items-center">
            <div className="flex -space-x-0.5">
              <dl>
                <dt className="sr-only">Members</dt>
                {roster.members.map((member) => (
                  <dd key={`${roster.id.asHex()}-${member}`}>
                    <span className="h-6 w-6 rounded-full bg-gray-50 ring-2 ring-white">
                      <Polkicon address={member} size={20} copy={true} />
                    </span>
                  </dd>
                ))}
              </dl>
            </div>
            <div className="flex gap-x-2.5">
              <a
                href="#placeholder"
                className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                View roster<span className="sr-only">, {roster.title.asText()}</span>
              </a>
            </div>
          </div>
        </li>
      ))}
    </ul>
  ); */
};

const RosterGroup: React.FC<{
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>> | undefined;
  rosters: Roster[];
  activeRoster: Roster | undefined;
  handleRosterClick: (roster: Roster) => void;
}> = ({ label, icon, rosters, activeRoster, handleRosterClick }) => {
  return (
    <Sidebar.Collapse
      icon={icon}
      label={label}
      open={activeRoster && rosters.some((roster) => roster === activeRoster)}
      disabled={rosters.length === 0}
      chevronIcon={rosters.length > 0 ? HiChevronDown : MdHorizontalRule}
      className={rosters.length === 0 ? "opacity-30 disabled:pointer-events-none" : ""}
    >
      {rosters.map((roster) => (
        <Sidebar.Item
          key={roster.id.asHex()}
          onClick={() => handleRosterClick(roster)}
          className={
            roster === activeRoster
              ? "cursor-pointer bg-gray-100 dark:bg-gray-700"
              : "cursor-pointer"
          }
        >
          {roster.title.asText()}
        </Sidebar.Item>
      ))}
    </Sidebar.Collapse>
  );
};

export default RostersList;
