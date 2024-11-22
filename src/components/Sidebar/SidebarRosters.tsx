import { useActiveAccount } from "@/contexts/ActiveAccount";
import { useNominations } from "@/contexts/Nominations";
import type { Roster } from "@/contexts/Rosters/types";
import { toApTitleCase } from "@/utils/typography";
import { Sidebar } from "flowbite-react";
import type React from "react";
import { useEffect, useState } from "react";
import { BsFillRocketTakeoffFill, BsHourglassSplit } from "react-icons/bs";
import { FaRegIdBadge, FaUserCheck } from "react-icons/fa";
import { HiChevronDown } from "react-icons/hi";
import { MdHorizontalRule } from "react-icons/md";

import { useRosters } from "@/contexts/Rosters";

const SidebarRosters: React.FC = () => {
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
        approvedForNominee(activeAccount)
          .map((nomination) => getRoster(nomination.roster))
          .filter((roster) => roster !== undefined),
      );
      setPendingForRosters(
        pendingForNominee(activeAccount)
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
      <Sidebar.ItemGroup>
        <Sidebar.Item className="pointer-events-none p-0 text-base uppercase [&>*:first-child]:px-0">
          <span className="text-gray-500">Rosters</span>
        </Sidebar.Item>
      </Sidebar.ItemGroup>
      <Sidebar.ItemGroup>
        <RosterGroup
          label="Founded"
          icon={BsFillRocketTakeoffFill}
          rosters={foundedRosters}
          activeRoster={activeRoster}
          handleRosterClick={handleRosterClick}
        />
        <RosterGroup
          label="Joined"
          icon={FaRegIdBadge}
          rosters={joinedRosters}
          activeRoster={activeRoster}
          handleRosterClick={handleRosterClick}
        />
        <RosterGroup
          label="Approved"
          icon={FaUserCheck}
          rosters={approvedForRosters}
          activeRoster={activeRoster}
          handleRosterClick={handleRosterClick}
        />
        <RosterGroup
          label="Pending"
          icon={BsHourglassSplit}
          rosters={pendingForRosters}
          activeRoster={activeRoster}
          handleRosterClick={handleRosterClick}
        />
      </Sidebar.ItemGroup>
    </>
  );
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
          active={roster === activeRoster}
          onClick={() => handleRosterClick(roster)}
          className={
            roster === activeRoster
              ? "cursor-pointer bg-gray-100 dark:bg-gray-700"
              : "cursor-pointer"
          }
        >
          {toApTitleCase(roster.title.asText())}
        </Sidebar.Item>
      ))}
    </Sidebar.Collapse>
  );
};

export default SidebarRosters;
