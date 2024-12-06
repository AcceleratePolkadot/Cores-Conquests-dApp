import Base from "@/components/Notifications/Base";
import type { NotificationContentProps } from "@/components/Notifications/Content/types";
import type { CustomContentProps } from "notistack";
import React from "react";

const MutationSuccessNotification = React.forwardRef<
  HTMLDivElement,
  NotificationContentProps & CustomContentProps
>((props, ref) => {
  return <Base {...props} type="success" addCloseButton ref={ref} />;
});

export default MutationSuccessNotification;
