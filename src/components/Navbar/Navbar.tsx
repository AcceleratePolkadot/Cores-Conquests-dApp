import { DarkThemeToggle, Navbar as FlowbiteNavbar } from "flowbite-react";
import type { FC } from "react";

const Navbar: FC = () => {
  return (
    <FlowbiteNavbar fluid>
      <div className="w-full p-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FlowbiteNavbar.Brand href="/">
              <img
                alt=""
                src="https://flowbite.com/docs/images/logo.svg"
                className="mr-3 h-6 sm:h-8"
              />
              <span className="self-center whitespace-nowrap font-semibold text-2xl dark:text-white">
                Flowbite
              </span>
            </FlowbiteNavbar.Brand>
          </div>
          <div className="flex items-center lg:gap-3">
            <div className="flex items-center">
              <DarkThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </FlowbiteNavbar>
  );
};

export default Navbar;
