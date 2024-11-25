import type React from "react";

import RosterDetail from "@/components/RosterDetail";
import { useRosters } from "@/contexts/Rosters";

const ContentPane: React.FC = () => {
  const { activeRoster } = useRosters();

  return (
    <main className="relative ml-64 min-h-[calc(100vh-64px)] w-full overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900">
      {activeRoster ? <RosterDetail /> : <div>No active roster</div>}
    </main>
  );
};

export default ContentPane;
