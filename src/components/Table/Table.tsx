"use client";

import type { FC, PropsWithChildren } from "react";

import type { TableBodyProps, TableHeadProps, TableProps } from "flowbite-react";
import { Table as FlowbiteTable } from "flowbite-react";

import type { TablePaginationProps } from "./TablePagination";
import TablePagination from "./TablePagination";

const TableHead: FC<PropsWithChildren & TableHeadProps> = ({ children, ...props }) => (
  <FlowbiteTable.Head {...props}>{children}</FlowbiteTable.Head>
);

const TableBody: FC<TableBodyProps & TableBodyProps> = ({ children, ...props }) => (
  <FlowbiteTable.Body {...props}>{children}</FlowbiteTable.Body>
);

const TableComponent = <T,>({
  children,
  theme: customTheme = {},
  paginateItems,
  setCurrentItems,
  ...props
}: PropsWithChildren & TableProps & TablePaginationProps<T>) => (
  <>
    <div className="overflow-x-visible">
      <FlowbiteTable theme={customTheme} {...props}>
        {children}
      </FlowbiteTable>
    </div>
    <TablePagination paginateItems={paginateItems} setCurrentItems={setCurrentItems} />
  </>
);

export const Table = Object.assign(TableComponent, {
  Head: TableHead,
  Body: TableBody,
});
