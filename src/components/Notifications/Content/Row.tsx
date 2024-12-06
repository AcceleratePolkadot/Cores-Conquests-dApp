import { fromSnakeCase, toApTitleCase } from "@/utils/typography";
import { Tooltip } from "flowbite-react";
import type { FC, PropsWithChildren } from "react";

import type {
  InfoValueOnly,
  InfoWithIcon,
  InfoWithLabel,
  NotificationAdditionalInformationRow,
} from "./types";

const IconRow: FC<InfoWithIcon> = ({ icon, value, tooltip }) => {
  return (
    <div className="flex items-center gap-2">
      <TooltipWrapper tooltip={tooltip}>{icon}</TooltipWrapper>
      <span className="truncate">{String(value)}</span>
    </div>
  );
};

const LabelRow: FC<InfoWithLabel> = ({ label, value, tooltip }) => {
  if (value === undefined) return;

  return (
    <div className="flex items-center gap-2">
      <TooltipWrapper tooltip={tooltip}>
        <span className="font-bold">{toApTitleCase(fromSnakeCase(label))}:</span>
      </TooltipWrapper>
      <span className="truncate">{String(value)}</span>
    </div>
  );
};

const StringRow: FC<InfoValueOnly> = ({ value, tooltip }) => {
  return (
    <TooltipWrapper tooltip={tooltip}>
      <span className="truncate">{String(value)}</span>
    </TooltipWrapper>
  );
};

const TooltipWrapper: FC<
  PropsWithChildren & {
    tooltip?: string;
  }
> = ({ children, tooltip }) => {
  if (!tooltip) {
    return <>{children}</>;
  }

  return (
    <Tooltip content={tooltip} placement="left">
      {children}
    </Tooltip>
  );
};

const Row: React.FC<NotificationAdditionalInformationRow> = (props) => {
  return (
    <>
      {"icon" in props ? (
        <IconRow {...props} />
      ) : "label" in props ? (
        <LabelRow {...props} />
      ) : (
        <StringRow {...props} />
      )}
    </>
  );
};

export default Row;
