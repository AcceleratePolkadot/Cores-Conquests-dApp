import React from "react";

import type { CustomContentProps } from "notistack";

import Base from "@/components/Notifications/Base";
import type { NotificationContentProps } from "@/components/Notifications/Content/types";

const MutationSuccessNotification = React.forwardRef<
  HTMLDivElement,
  NotificationContentProps & CustomContentProps
>((props, ref) => {
  return <Base {...props} type="success" addCloseButton ref={ref} />;
});

export default MutationSuccessNotification;
