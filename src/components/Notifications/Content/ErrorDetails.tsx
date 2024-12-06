import { Tooltip } from "flowbite-react";
import type { TxFinalized } from "polkadot-api";
import type React from "react";
import { GiSkullCrack } from "react-icons/gi";
import { PiStackFill } from "react-icons/pi";
import Divider from "./Divider";

interface ErrorDetailsProps {
  error?: {
    message?: string;
    stack?: string;
  };
  dispatchError?: TxFinalized["dispatchError"];
}

const ErrorDetails: React.FC<ErrorDetailsProps> = ({ error, dispatchError }) => {
  if (!error && !dispatchError) return null;

  return (
    <>
      {error && (
        <div className="space-y-1 pb-2 dark:bg-inherit">
          <Divider label="Error" />

          {error.message && (
            <div className="flex items-center gap-2">
              <Tooltip content="Error message" placement="left">
                <GiSkullCrack />
              </Tooltip>
              <span className="truncate">{error.message}</span>
            </div>
          )}

          {error.stack && (
            <div className="relative flex items-center gap-2">
              <div className="absolute top-0 left-0">
                <Tooltip content="Stack trace" placement="left">
                  <PiStackFill />
                </Tooltip>
              </div>
              <div className="pl-6">
                <pre>{error.stack}</pre>
              </div>
            </div>
          )}
        </div>
      )}
      {dispatchError && (
        <div className="space-y-1 pb-2 dark:bg-inherit">
          <Divider label="Dispatch Error" />

          <div className="flex items-center gap-2">
            <Tooltip content="Dispatch error type" placement="left">
              <GiSkullCrack />
            </Tooltip>
            <span className="truncate">{dispatchError.type}</span>
          </div>

          <div className="relative flex items-center gap-2">
            <div className="absolute top-0 left-0">
              <Tooltip content="Dispatch error value" placement="left">
                <PiStackFill />
              </Tooltip>
            </div>
            <div className="pl-6">
              <pre>{JSON.stringify(dispatchError.value, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ErrorDetails;
