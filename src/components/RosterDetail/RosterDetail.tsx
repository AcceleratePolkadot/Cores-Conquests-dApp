import { Button, Card, Tooltip } from "flowbite-react";
import type { FC } from "react";
import { FaCheck } from "react-icons/fa";
import { GiCrossedBones, GiHeartPlus } from "react-icons/gi";

import Rosticon from "@/components/Rosticon";
import TruncatedHash from "@/components/TruncatedHash";
import { useActiveAccount } from "@/contexts/ActiveAccount";
import { useRosters } from "@/contexts/Rosters";
import { toApTitleCase } from "@/utils/typography";
import { Polkicon } from "@w3ux/react-polkicon";

const RosterDetail: FC = () => {
  const formatter = new Intl.NumberFormat("en-US");
  const { activeRoster } = useRosters();
  const { activeAccount } = useActiveAccount();

  const onDeactivateRoster = () => {
    console.log("Deactivate Roster");
  };

  const onActivateRoster = () => {
    console.log("Activate Roster");
  };

  return (
    activeRoster && (
      <Card>
        <div className="flex items-center gap-x-4 border-gray-200 border-b pb-2 dark:border-gray-700 dark:text-white">
          <Rosticon rosterId={activeRoster.id} className="h-10 w-10 flex-none" copy={true} />

          <h2 className="flex-1 truncate font-bold text-2xl">
            {toApTitleCase(activeRoster.title.asText())}
          </h2>
        </div>
        <dl className="-my-3 divide-y divide-gray-200 py-1 text-sm leading-6 dark:divide-gray-700">
          <div className="flex justify-between gap-x-4 py-3">
            <dt className="text-nowrap dark:text-white">Id:</dt>
            <dd className="flex justify-center overflow-hidden text-ellipsis text-gray-700 dark:text-gray-300">
              <TruncatedHash hash={activeRoster.id.asHex()} />
            </dd>
          </div>
          <div className="flex justify-between gap-x-4 py-3">
            <dt className="text-nowrap dark:text-white">Founder:</dt>
            <dd className="flex justify-center overflow-hidden text-ellipsis text-gray-700 dark:text-gray-300">
              <Polkicon address={activeRoster.founder} />
            </dd>
          </div>
          <div className="flex justify-between gap-x-4 py-3">
            <dt className="dark:text-white">Founded on Block:</dt>
            <dd className="flex items-start gap-x-2">
              <div className="font-medium text-gray-700 dark:text-gray-300">
                <a
                  href={`https://polkadot.js.org/apps/#/explorer/query/${activeRoster.founded_on}`}
                >
                  #{formatter.format(activeRoster.founded_on)}
                </a>
              </div>
            </dd>
          </div>
          <div className="flex justify-between gap-x-4 py-3">
            <dt className="text-nowrap dark:text-white">Status:</dt>
            <dd className="flex justify-center text-gray-700 dark:text-gray-300">
              {activeRoster.status.type === "Active" ? (
                <Tooltip content="Roster Active" placement="right">
                  <FaCheck className="text-green-500" />
                </Tooltip>
              ) : (
                <Tooltip content="Roster Inactive" placement="right">
                  <GiCrossedBones className="text-red-500" />
                </Tooltip>
              )}
            </dd>
          </div>
        </dl>
        {activeRoster.founder === activeAccount?.address && (
          <div className="flex justify-center space-x-4 p-6">
            {activeRoster.status.type === "Active" ? (
              <Button onClick={onDeactivateRoster} size="lg" gradientMonochrome="failure">
                <GiCrossedBones className="mr-2 h-6 w-6" /> Deactivate
              </Button>
            ) : (
              <>
                <Button onClick={onActivateRoster} size="lg" gradientMonochrome="success">
                  <GiHeartPlus className="mr-2 h-4 w-4" /> Re-Activate
                </Button>
              </>
            )}
          </div>
        )}
      </Card>
    )
  );
};

export default RosterDetail;
