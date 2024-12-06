import type React from "react";

import { Card } from "flowbite-react";

import { useRosters } from "@/contexts/Rosters";

import { toApTitleCase } from "@/utils/typography";

import MembersList from "@/components/MembersList";
import RosterDetail from "@/components/RosterDetail";

const ContentPane: React.FC = () => {
  const { activeRoster } = useRosters();

  return (
    <main className="relative ml-64 min-h-[calc(100vh-64px)] w-full overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900">
      <div className="grid grid-cols-1 gap-2 p-2 xl:grid-cols-5 xl:gap-4 xl:p-4 2xl:grid-cols-4 2xl:gap-6 2xl:p-6 dark:bg-gray-900">
        {activeRoster && (
          <>
            <div className="col-span-full border-gray-200 border-b pb-2 dark:border-gray-700">
              <h1 className="font-semibold text-2xl text-gray-900 dark:text-white">
                {toApTitleCase(activeRoster.title.asText())}
              </h1>
            </div>

            <div className="col-span-full xl:col-span-2 2xl:col-span-1">
              <div className="space-y-2 xl:space-y-4 2xl:space-y-6">
                <RosterDetail />
              </div>
            </div>

            <div className="col-span-full space-y-2 xl:col-span-3 xl:space-y-4 2xl:col-span-3 2xl:space-y-6">
              <Card>
                <MembersList />
              </Card>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default ContentPane;
