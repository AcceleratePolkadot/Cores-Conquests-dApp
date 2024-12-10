import { Polkicon } from "@w3ux/react-polkicon";
import clsx from "clsx";
import { Button, Drawer, Pagination, Tabs } from "flowbite-react";
import type React from "react";
import { useEffect, useState } from "react";

import { BsFillRocketTakeoffFill, BsHourglassSplit } from "react-icons/bs";
import { FaRegIdBadge, FaUserCheck } from "react-icons/fa";
import { MdGroups2 } from "react-icons/md";

import RosterAdd from "@/components/RosterAdd/RosterAdd";
import { useActiveAccount } from "@/contexts/ActiveAccount";
import { useNominations } from "@/contexts/Nominations";
import { useRosters } from "@/contexts/Rosters";
import type { Roster } from "@/contexts/Rosters/types";

import Rosticon from "@/components/Rosticon";
import { toApTitleCase } from "@/utils/typography";

import { tabsTheme } from "./theme";

const RostersDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { foundedBy, memberOf, activeRoster, setActiveRoster, getRoster } = useRosters();
  const { approvedForNominee, pendingForNominee } = useNominations();
  const { activeAccount } = useActiveAccount();
  const [foundedRosters, setFoundedRosters] = useState<Roster[]>([]);
  const [joinedRosters, setJoinedRosters] = useState<Roster[]>([]);
  const [approvedForRosters, setApprovedForRosters] = useState<Roster[]>([]);
  const [pendingForRosters, setPendingForRosters] = useState<Roster[]>([]);

  useEffect(() => {
    if (activeAccount) {
      setFoundedRosters(foundedBy(activeAccount));
      setJoinedRosters(
        memberOf(activeAccount).filter((roster) => !foundedBy(activeAccount).includes(roster)),
      );
      setApprovedForRosters(
        approvedForNominee(activeAccount.address)
          .map((nomination) => getRoster(nomination.roster))
          .filter((roster) => roster !== undefined),
      );
      setPendingForRosters(
        pendingForNominee(activeAccount.address)
          .map((nomination) => getRoster(nomination.roster))
          .filter((roster) => roster !== undefined),
      );
    } else {
      setFoundedRosters([]);
      setJoinedRosters([]);
      setApprovedForRosters([]);
      setPendingForRosters([]);
    }
  }, [activeAccount, foundedBy, memberOf, approvedForNominee, pendingForNominee, getRoster]);

  const handleRosterClick = (roster: Roster) => {
    setActiveRoster(roster);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-slate-100 p-0 text-gray-500 focus:ring-0 enabled:hover:bg-slate-200 dark:bg-gray-800 dark:text-gray-300 enabled:dark:hover:bg-gray-600"
        disabled={!activeAccount}
      >
        <MdGroups2 className="h-5 w-5" />
      </Button>
      <Drawer open={isOpen} onClose={() => setIsOpen(false)} position="bottom" className="p-0">
        <Drawer.Header titleIcon={() => <MdGroups2 className="hidden" />} />
        <Drawer.Items>
          <Tabs aria-label="Roster categories" theme={tabsTheme}>
            <Tabs.Item active title="Founded" icon={BsFillRocketTakeoffFill}>
              <RosterGrid
                rosters={foundedRosters}
                activeRoster={activeRoster}
                onRosterClick={handleRosterClick}
              />
              <div className="flex items-center justify-center py-8 text-gray-500">
                <RosterAdd />
              </div>
            </Tabs.Item>
            <Tabs.Item title="Joined" icon={FaRegIdBadge}>
              <RosterGrid
                rosters={joinedRosters}
                activeRoster={activeRoster}
                onRosterClick={handleRosterClick}
              />
            </Tabs.Item>
            <Tabs.Item title="Approved" icon={FaUserCheck}>
              <RosterGrid
                rosters={approvedForRosters}
                activeRoster={activeRoster}
                onRosterClick={handleRosterClick}
              />
            </Tabs.Item>
            <Tabs.Item title="Pending" icon={BsHourglassSplit}>
              <RosterGrid
                rosters={pendingForRosters}
                activeRoster={activeRoster}
                onRosterClick={handleRosterClick}
              />
            </Tabs.Item>
          </Tabs>
        </Drawer.Items>
      </Drawer>
    </>
  );
};

interface RosterGridProps {
  rosters: Roster[];
  activeRoster: Roster | undefined;
  onRosterClick: (roster: Roster) => void;
}

const RosterGrid: React.FC<RosterGridProps> = ({ rosters, activeRoster, onRosterClick }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rostersPerPage = 3;

  if (rosters.length === 0) {
    return <div className="py-8 text-center text-gray-500">No rosters found</div>;
  }

  const indexOfLastRoster = currentPage * rostersPerPage;
  const indexOfFirstRoster = indexOfLastRoster - rostersPerPage;
  const currentRosters = rosters.slice(indexOfFirstRoster, indexOfLastRoster);
  const totalPages = Math.ceil(rosters.length / rostersPerPage);

  return (
    <div>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {currentRosters.map((roster) => (
          <li
            key={roster.id.asHex()}
            className={clsx(
              "col-span-1 divide-y divide-gray-200 rounded-lg bg-gray-50/10 shadow transition-all hover:shadow-fuchsia-400/10 hover:shadow-xl dark:divide-gray-700 dark:bg-gray-700/10",
              roster.id.asHex() === activeRoster?.id.asHex() &&
                "shadow-amber-200/40 shadow-xl hover:shadow-amber-200/40",
            )}
          >
            <button
              type="button"
              className="w-full text-left"
              onClick={() => onRosterClick(roster)}
            >
              <div className="flex w-full items-center justify-between space-x-6 p-6">
                <div className="flex-1 truncate">
                  <div className="flex items-center space-x-3">
                    <h3 className="truncate font-medium text-base text-gray-900 dark:text-white">
                      {toApTitleCase(roster.title.asText())}
                    </h3>
                    {roster.status.type === "Active" && (
                      <span className="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 font-medium text-green-700 text-xs dark:bg-green-900 dark:text-green-200">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="truncate">{roster.id.asHex()}</span>
                  </div>
                </div>
                <Rosticon rosterId={roster.id} className="h-20 w-20 flex-shrink-0" />
              </div>
            </button>
          </li>
        ))}
      </ul>
      {totalPages > 1 && (
        <div className="mt-6 flex overflow-x-auto sm:justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            showIcons
          />
        </div>
      )}
    </div>
  );
};

export default RostersDrawer;
