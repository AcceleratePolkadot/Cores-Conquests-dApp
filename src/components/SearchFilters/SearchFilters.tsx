"use client";

import type { FC, PropsWithChildren, ReactElement } from "react";
import { FaRegTrashAlt } from "react-icons/fa";

import { Dropdown } from "flowbite-react";

type SearchProps = {
  searchValue: string;
  setSearchValue: (value: string) => void;
};

const Search: FC<SearchProps> = ({ searchValue, setSearchValue }) => (
  <form className="w-full flex-1 md:mr-4 md:max-w-sm">
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <svg
          aria-hidden="true"
          className="h-4 w-4 text-gray-500 dark:text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="search"
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 pl-10 text-gray-900 text-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
        placeholder="Search..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
    </div>
  </form>
);

const FiltersDropdown: FC<PropsWithChildren> = ({ children }) => (
  <div>
    <Dropdown
      label=""
      dismissOnClick={true}
      renderTrigger={() => (
        <button
          type="button"
          className="flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 font-medium text-gray-900 text-sm hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 md:w-auto dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:focus:ring-gray-700 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="mr-2 h-4 w-4 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
            />
          </svg>
          Filter
          <svg
            className="-mr-1 ml-1.5 h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            />
          </svg>
        </button>
      )}
    >
      {children}
    </Dropdown>
  </div>
);

type SearchFiltersProps = {
  filters?: ReactElement;
  searchValue: string;
  setSearchValue: (value: string) => void;
  clearFilters: () => void;
};

const SearchFilters: FC<SearchFiltersProps> = ({
  filters,
  searchValue,
  setSearchValue,
  clearFilters,
}) => (
  <>
    <div className="flex flex-col-reverse items-center justify-between py-3 md:flex-row md:space-x-4">
      <div className="flex w-full flex-col space-y-3 md:flex-row md:items-center md:space-y-0 lg:w-2/3">
        <Search searchValue={searchValue} setSearchValue={setSearchValue} />
        <div className="flex items-center space-x-4">
          {filters && <FiltersDropdown>{filters}</FiltersDropdown>}
          <button
            type="button"
            className="flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 font-medium text-gray-900 text-sm opacity-60 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 md:w-auto dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:focus:ring-gray-700 dark:hover:bg-gray-700 dark:hover:text-white"
            onClick={clearFilters}
          >
            <FaRegTrashAlt className="mr-2 h-4 w-4 text-gray-400" />
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  </>
);

export default SearchFilters;
