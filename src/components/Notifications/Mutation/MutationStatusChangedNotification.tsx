import type { NotificationContentProps } from "@/components/Notifications/Content/types";
import type { CustomContentProps } from "notistack";
import React from "react";
import { HiStatusOnline } from "react-icons/hi";

import Base from "@/components/Notifications/Base";

const MutationStatusChangedNotification = React.forwardRef<
  HTMLDivElement,
  NotificationContentProps & CustomContentProps
>((props, ref) => {
  const { icon } = props;

  return <Base {...props} type="status-changed" icon={icon ?? <HiStatusOnline />} ref={ref} />;
});

export default MutationStatusChangedNotification;
