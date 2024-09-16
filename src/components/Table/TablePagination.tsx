"use client";

import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

export interface TablePaginationProps<T> {
  paginateItems: T[];
  setCurrentItems: (items: T[]) => void;
}

const TablePagination = <T,>({ paginateItems, setCurrentItems }: TablePaginationProps<T>) => {
  const [itemOffset, setItemOffset] = useState<number>(0);
  const itemsPerPage = 5;
  const [pageCount, setPageCount] = useState<number>(
    Math.ceil(paginateItems.length / itemsPerPage),
  );
  const [endOffset, setEndOffset] = useState<number>(itemOffset + itemsPerPage);
  const [displayOffsets, setDisplayOffsets] = useState<{ start: number; end: number }>({
    start: 1,
    end: itemsPerPage,
  });

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % paginateItems.length;
    setItemOffset(newOffset);
  };

  useEffect(() => {
    setPageCount(Math.ceil(paginateItems.length / itemsPerPage));
  }, [paginateItems.length]);

  useEffect(() => {
    setEndOffset(Math.ceil(itemOffset + itemsPerPage));
  }, [itemOffset]);

  useEffect(() => {
    setDisplayOffsets({
      start: itemOffset + 1,
      end: endOffset <= paginateItems.length ? endOffset : paginateItems.length,
    });
  }, [itemOffset, endOffset, paginateItems.length]);

  useEffect(() => {
    setCurrentItems(paginateItems.slice(itemOffset, endOffset));
  }, [itemOffset, paginateItems, endOffset, setCurrentItems]);

  useEffect(() => {
    setItemOffset(0);
  }, []);

  return (
    <>
      <nav
        className="flex flex-col items-start justify-between space-y-3 p-4 md:flex-row md:items-center md:space-y-0"
        aria-label="Table navigation"
      >
        <span className="font-normal text-gray-500 text-sm dark:text-gray-400">
          Showing{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {displayOffsets.start}-{displayOffsets.end}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {paginateItems.length}
          </span>
        </span>
        <ReactPaginate
          key={pageCount}
          breakLabel="..."
          nextLabel={
            <svg
              className="h-5 w-5"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          }
          onPageChange={handlePageClick}
          pageRangeDisplayed={2}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel={
            <svg
              className="h-5 w-5"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          }
          renderOnZeroPageCount={null}
          containerClassName="inline-flex items-stretch -space-x-px"
          breakLinkClassName="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          pageLinkClassName="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          previousLinkClassName="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          nextLinkClassName="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          activeLinkClassName="font-semibold text-primary-600 dark:text-primary-400"
        />
      </nav>
    </>
  );
};

export default TablePagination;
