import React, { useState } from "react";

import clsx from "clsx";
import { Accordion } from "flowbite-react";
import { SnackbarContent, useSnackbar } from "notistack";
import type { CustomContentProps } from "notistack";
import DotLoader from "react-spinners/DotLoader";

import { FaEye } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";

import NotificationContent from "@/components/Notifications/Content";
import type { NotificationContentProps } from "@/components/Notifications/Content/types";

type BaseProps = {
  type: "pending" | "success" | "failure" | "status-changed";
  useSpinner?: boolean;
  addCloseButton?: boolean;
};

const Base = React.forwardRef<
  HTMLDivElement,
  NotificationContentProps & CustomContentProps & BaseProps
>((props, ref) => {
  const { message, type, useSpinner = false, addCloseButton = false } = props;
  const { closeSnackbar } = useSnackbar();
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => closeSnackbar(props.id), 100);
  };

  const titleBgs = {
    pending: "dark:bg-slate-600",
    success: "dark:bg-green-600",
    failure: "dark:bg-red-600",
    "status-changed": "dark:bg-violet-600",
  };

  const contentBgs = {
    pending: "dark:bg-slate-500",
    success: "dark:bg-green-800",
    failure: "dark:bg-red-800",
    "status-changed": "dark:bg-violet-800",
  };

  return (
    <SnackbarContent ref={ref} role="alert">
      <Accordion collapseAll className={clsx(titleBgs[type])}>
        <Accordion.Panel>
          <Accordion.Title
            className={clsx(titleBgs[type], "dark:text-gray-200", {
              "[&>svg]:rotate-0": closing,
            })}
          >
            <div className="flex items-center gap-4 pr-14">
              {useSpinner ? (
                <DotLoader color="#e5e7eb" size={10} aria-label="Loading Spinner" />
              ) : "icon" in props ? (
                props.icon
              ) : (
                <FaEye />
              )}
              {message}
            </div>
            {addCloseButton && (
              <div className="absolute top-5 right-12 rounded-full p-1 hover:bg-white/75 hover:text-slate-700">
                <IoCloseSharp onClick={handleClose} className="h-5 w-5" />
              </div>
            )}
          </Accordion.Title>
          <Accordion.Content
            className={clsx(
              "scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent max-h-[50vh] space-y-4 overflow-y-scroll text-sm",
              contentBgs[type],
              {
                hidden: closing,
              },
            )}
          >
            <NotificationContent {...props} />
          </Accordion.Content>
        </Accordion.Panel>
      </Accordion>
    </SnackbarContent>
  );
});

export default Base;
