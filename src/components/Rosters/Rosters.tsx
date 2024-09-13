import { useAccounts } from "@/contexts/Accounts";
import type { Roster } from "@/contexts/Rosters";
import { Sidebar } from "flowbite-react";
import type React from "react";
import { useEffect, useState } from "react";
import { BsFillRocketTakeoffFill } from "react-icons/bs";
import { FaRegIdBadge } from "react-icons/fa";

import { useRosters } from "@/contexts/Rosters";

const Rosters: React.FC = () => {
  const { foundedBy, memberOf, activeRoster, setActiveRoster } = useRosters();
  const { activeAccount } = useAccounts();
  const [foundedRosters, setFoundedRosters] = useState<Roster[]>([]);
  const [joinedRosters, setJoinedRosters] = useState<Roster[]>([]);

  useEffect(() => {
    if (activeAccount) {
      setFoundedRosters(foundedBy(activeAccount.address));
      setJoinedRosters(
        memberOf(activeAccount.address).filter(
          (roster) => !foundedBy(activeAccount.address).includes(roster),
        ),
      );
    }
  }, [activeAccount, foundedBy, memberOf]);

  const handleRosterClick = (roster: Roster) => {
    setActiveRoster(roster);
  };

  return (
    <>
      <Sidebar.Collapse
        icon={BsFillRocketTakeoffFill}
        label="Founded"
        open={activeRoster && foundedRosters.some((roster) => roster === activeRoster)}
      >
        {foundedRosters.map((roster) => (
          <Sidebar.Item
            key={roster.id.asHex()}
            onClick={() => handleRosterClick(roster)}
            className={roster === activeRoster ? "bg-gray-100 dark:bg-gray-700" : ""}
          >
            {roster.title.asText()}
          </Sidebar.Item>
        ))}
      </Sidebar.Collapse>
      <Sidebar.Collapse
        icon={FaRegIdBadge}
        label="Joined"
        open={activeRoster && joinedRosters.some((roster) => roster === activeRoster)}
      >
        {joinedRosters.map((roster) => (
          <Sidebar.Item
            key={roster.id.asHex()}
            onClick={() => handleRosterClick(roster)}
            className={roster === activeRoster ? "bg-gray-100 dark:bg-gray-700" : ""}
          >
            {roster.title.asText()}
          </Sidebar.Item>
        ))}
      </Sidebar.Collapse>
    </>
  );
};

export default Rosters;
