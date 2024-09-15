import { RostersList } from "@/components/Rosters";
import { useRosters } from "@/contexts/Rosters";
import { Card } from "flowbite-react";
import type React from "react";

import { MembersList } from "@/components/Members";
import RosterDetail from "@/components/Rosters/RosterDetail";

const RostersContent: React.FC = () => {
  const { activeRoster } = useRosters();

  return (
    <>
      <div className="grid grid-cols-1 gap-2 p-2 xl:grid-cols-5 xl:gap-4 xl:p-4 2xl:grid-cols-4 2xl:gap-6 2xl:p-6 dark:bg-gray-900">
        {!activeRoster ? (
          <>
            <div className="col-span-full border-gray-200 border-b pb-2 dark:border-gray-700">
              <h1 className="font-semibold text-2xl text-gray-900 dark:text-white">Rosters List</h1>
            </div>
            <div className="col-span-full">
              <RostersList />
            </div>
          </>
        ) : (
          <>
            <div className="col-span-full border-gray-200 border-b pb-2 dark:border-gray-700">
              <h1 className="font-semibold text-2xl text-gray-900 dark:text-white">
                {activeRoster.title.asText()}
              </h1>
            </div>

            <div className="col-span-full xl:col-span-2 2xl:col-span-1">
              <div className="space-y-2 xl:space-y-4 2xl:space-y-6">
                <RosterDetail />
                <Card>
                  <h3 className="mb-1 font-bold text-2xl text-gray-900 dark:text-white">
                    Nominations
                  </h3>
                </Card>
              </div>
            </div>

            <div className="col-span-full xl:col-span-3 2xl:col-span-3">
              <Card>
                <MembersList />
              </Card>
            </div>

            <div className="col-span-full">
              <Card>
                <h3 className="mb-1 font-bold text-2xl text-gray-900 dark:text-white">
                  Expulsion Proposals
                </h3>
              </Card>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default RostersContent;
