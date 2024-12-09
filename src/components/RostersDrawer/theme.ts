import type { CustomFlowbiteTheme } from "flowbite-react";

const tabsTheme: CustomFlowbiteTheme["tabs"] = {
  tablist: {
    tabitem: {
      base: "flex items-center justify-center rounded-t-lg p-4 text-sm font-medium first:ml-0 focus:none disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500",
      variant: {
        default: {
          active: {
            on: "bg-gray-50 text-slate-800 dark:bg-gray-700 dark:text-white",
          },
        },
      },
    },
  },
  tabitemcontainer: {
    base: "min-h-40",
  },
};

export { tabsTheme };
