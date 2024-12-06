import React from "react";

import { HiStatusOnline } from "react-icons/hi";

import type { CustomContentProps } from "notistack";

import Base from "@/components/Notifications/Base";
import type { NotificationContentProps } from "@/components/Notifications/Content/types";

const MutationStatusChangedNotification = React.forwardRef<
  HTMLDivElement,
  NotificationContentProps & CustomContentProps
>((props, ref) => {
  const { icon } = props;

  return <Base {...props} type="status-changed" icon={icon ?? <HiStatusOnline />} ref={ref} />;
});

export default MutationStatusChangedNotification;
