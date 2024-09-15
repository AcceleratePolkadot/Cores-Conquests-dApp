import type { TableCustomTheme } from "./types";

export const customTableTheme: TableCustomTheme = {
  root: {
    base: "w-full text-sm text-left text-gray-500 dark:text-gray-400",
  },
  head: {
    base: "text-xs text-gray-700 uppercase bg-gray-50",
  },
  body: {
    base: "divide-y",
  },
  foot: {
    base: "text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400",
  },
};
