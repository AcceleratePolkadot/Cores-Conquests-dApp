import type { CustomFlowbiteTheme } from "flowbite-react";

export interface TableFootCellTheme {
  base: string;
}

export interface TableFootTheme {
  base: string;
  cell: TableFootCellTheme;
}

export type TableCustomTheme = CustomFlowbiteTheme["table"] & {
  foot?: Partial<TableFootTheme>;
};
