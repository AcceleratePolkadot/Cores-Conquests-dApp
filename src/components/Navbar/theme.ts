import type { CustomFlowbiteTheme } from "flowbite-react";

const navbarTheme: CustomFlowbiteTheme["navbar"] = {
  root: {
    base: "bg-slate-100 px-6 py-4 dark:bg-gray-800 text-gray-500 dark:text-gray-300",
    inner: {
      base: "flex justify-end gap-6",
    },
  },
};

const dropdownTheme: CustomFlowbiteTheme["dropdown"] = {
  content: "py-0 focus:outline-none text-gray-500 dark:text-gray-300",
  floating: {
    divider: "h-px bg-slate-100 dark:bg-gray-600",
    header: "block px-4 py-4 text-2xl text-gray-900 dark:text-white",
    item: {
      container: "",
      base: "flex w-full cursor-pointer items-center justify-start p-4 text-base hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:hover:bg-gray-600 dark:hover:text-white dark:focus:bg-gray-600 dark:focus:text-white",
    },
    style: {
      auto: "bg-white dark:bg-gray-700 rounded-lg",
    },
  },
};

export { dropdownTheme, navbarTheme };
