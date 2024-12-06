import type { NotificationContentProps } from "@/components/Notifications/Content/types";
import type { CustomContentProps } from "notistack";
import React from "react";

import Base from "@/components/Notifications/Base";

const MutationFailureNotification = React.forwardRef<
  HTMLDivElement,
  NotificationContentProps & CustomContentProps
>((props, ref) => {
  return <Base {...props} type="failure" addCloseButton ref={ref} />;
});

export default MutationFailureNotification;
