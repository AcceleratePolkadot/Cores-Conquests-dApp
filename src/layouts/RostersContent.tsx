import { MembersList } from "@/components/Members";
import { NominationsList } from "@/components/Nominations";
import { RostersList } from "@/components/Rosters";
import RosterDetail from "@/components/Rosters/RosterDetail";
import { useRosters } from "@/contexts/Rosters";
import { toApTitleCase } from "@/helpers/typography";
import { Card } from "flowbite-react";
import type React from "react";

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

              <Card>
                <NominationsList />
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
