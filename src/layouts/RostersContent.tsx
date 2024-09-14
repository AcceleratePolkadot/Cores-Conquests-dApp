import { RostersList } from "@/components/Rosters";
import { useRosters } from "@/contexts/Rosters";
import { Card } from "flowbite-react";
import type React from "react";

const RostersContent: React.FC = () => {
  const { activeRoster } = useRosters();

  return (
    <>
      <div className="grid grid-cols-4 gap-6 p-6 dark:bg-gray-900">
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
            <div className="col-span-full">
              <h1 className="font-semibold text-2xl text-gray-900 dark:text-white">
                {activeRoster.title.asText()}
              </h1>
            </div>

            <div className="col-span-1">
              <div className="space-y-6">
                <Card>
                  <h3 className="mb-1 font-bold text-2xl text-gray-900 dark:text-white">
                    Roster Details
                  </h3>
                </Card>
                <Card>
                  <h3 className="mb-1 font-bold text-2xl text-gray-900 dark:text-white">
                    Nominations
                  </h3>
                </Card>
              </div>
            </div>

            <div className="col-span-3">
              <Card>
                <h3 className="mb-1 font-bold text-2xl text-gray-900 dark:text-white">Members</h3>
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
