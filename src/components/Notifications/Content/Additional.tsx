import type React from "react";

import Divider from "./Divider";
import Row from "./Row";

import type { NotificationAdditionalInformationGroup } from "./types";

interface AdditionalProps {
  additional?: NotificationAdditionalInformationGroup[];
}

const Additional: React.FC<AdditionalProps> = ({ additional }) => {
  if (!additional?.length) return null;

  return (
    <>
      {additional.map((group) => (
        <div key={group.label} className="dark:bg-inherit">
          <div className="space-y-1 dark:bg-inherit">
            <Divider label={group.label} />
            {group.rows.map((row, index) => (
              <Row key={`${row.value}-${index}`} {...row} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default Additional;
