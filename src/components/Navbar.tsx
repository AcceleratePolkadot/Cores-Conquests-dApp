import { useSidebarContext } from "@/contexts/SidebarContext";
import isSmallScreen from "@/helpers/is-small-screen";
import { DarkThemeToggle, Navbar as FowbiteNavbar } from "flowbite-react";
import type { FC } from "react";
import { HiMenuAlt1, HiX } from "react-icons/hi";

import Accounts from "@/components/Accounts";
import Extensions from "@/components/Extensions";

const Navbar: FC = () => {
  const { isOpenOnSmallScreens, isPageWithSidebar, setOpenOnSmallScreens } = useSidebarContext();

  return (
    <FowbiteNavbar fluid>
      <div className="w-full p-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {isPageWithSidebar && (
              <button
                type="button"
                onClick={() => setOpenOnSmallScreens(!isOpenOnSmallScreens)}
                className="mr-3 cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 lg:inline dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span className="sr-only">Toggle sidebar</span>
                {isOpenOnSmallScreens && isSmallScreen() ? (
                  <HiX className="h-6 w-6" />
                ) : (
                  <HiMenuAlt1 className="h-6 w-6" />
                )}
              </button>
            )}
            <FowbiteNavbar.Brand href="/">
              <img
                alt=""
                src="https://flowbite.com/docs/images/logo.svg"
                className="mr-3 h-6 sm:h-8"
              />
              <span className="self-center whitespace-nowrap font-semibold text-2xl dark:text-white">
                Flowbite
              </span>
            </FowbiteNavbar.Brand>
          </div>
          <div className="flex items-center lg:gap-3">
            <div className="flex items-center">
              <DarkThemeToggle />
              <Extensions />
              <Accounts />
            </div>
          </div>
        </div>
      </div>
    </FowbiteNavbar>
  );
};

export default Navbar;
