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
    pending:
      "text-white bg-slate-600 hover:bg-slate-600 hover:dark:bg-slate-600 dark:bg-slate-600 dark:text-white",
    success:
      "text-white bg-green-600 hover:bg-green-600 hover:dark:bg-green-600 dark:bg-green-600 dark:text-white",
    failure:
      "text-white bg-red-600 hover:bg-red-600 dark:bg-red-600 hover:dark:bg-red-600 dark:text-white",
    "status-changed":
      "text-white bg-violet-600 hover:bg-violet-600 hover:dark:bg-violet-600 dark:bg-violet-600 dark:text-white",
  };

  const contentBgs = {
    pending:
      "text-white bg-slate-500 hover:bg-slate-500 hover:dark:bg-slate-500 dark:bg-slate-500 dark:text-white",
    success:
      "text-white bg-green-500 hover:bg-green-500 hover:dark:bg-green-500 dark:bg-green-500 dark:text-white",
    failure:
      "text-white bg-red-500 hover:bg-red-500 hover:dark:bg-red-500 dark:bg-red-500 dark:text-white",
    "status-changed":
      "text-white bg-violet-500 hover:bg-violet-500 hover:dark:bg-violet-500 dark:bg-violet-500 dark:text-white",
  };

  return (
    <SnackbarContent ref={ref} role="alert">
      <Accordion
        collapseAll
        className="divide-none rounded-none border-none [&>button]:first:rounded-t-none [&>button]:last:rounded-b-none"
      >
        <Accordion.Panel>
          <Accordion.Title
            className={clsx("min-w-72 focus:ring-0", titleBgs[type], {
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
              "scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent max-h-[50vh] space-y-4 overflow-y-scroll text-sm first:rounded-t-none last:rounded-b-none",
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
