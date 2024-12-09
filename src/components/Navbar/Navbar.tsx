import type { FC } from "react";

import { DarkThemeToggle, Navbar as FlowbiteNavbar } from "flowbite-react";

import RostersDrawer from "@/components/RostersDrawer";
import AccountsDropdown from "./AccountsDropdown";
import WalletsDropdown from "./WalletsDropdown";

import { navbarTheme } from "./theme";

const Navbar: FC = () => {
  return (
    <FlowbiteNavbar fluid theme={navbarTheme}>
      <WalletsDropdown />
      <AccountsDropdown />
      <RostersDrawer />
      <DarkThemeToggle />
    </FlowbiteNavbar>
  );
};

export default Navbar;
