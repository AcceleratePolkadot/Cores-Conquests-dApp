import Base from "@/components/Notifications/Base";
import type { NotificationContentProps } from "@/components/Notifications/Content/types";
import type { CustomContentProps } from "notistack";
import React from "react";

const MutationPendingNotification = React.forwardRef<
  HTMLDivElement,
  NotificationContentProps & CustomContentProps
>((props, ref) => {
  return <Base {...props} type="pending" useSpinner ref={ref} />;
});

export default MutationPendingNotification;