import clsx from "clsx";
import { Sidebar as FlowbiteSidebar } from "flowbite-react";
import type { FC } from "react";

import { useSidebarContext } from "@/contexts/SidebarContext";
import isSmallScreen from "@/helpers/is-small-screen";

import Rosters from "@/components/Rosters";

const Sidebar: FC = () => {
  const { isOpenOnSmallScreens: isSidebarOpenOnSmallScreens } = useSidebarContext();

  return (
    <div
      className={clsx("lg:!block", {
        hidden: !isSidebarOpenOnSmallScreens,
      })}
    >
      <FlowbiteSidebar
        aria-label="Sidebar with multi-level dropdown example"
        collapsed={isSidebarOpenOnSmallScreens && !isSmallScreen()}
      >
        <div className="flex h-full flex-col justify-between py-2">
          <div>
            <FlowbiteSidebar.Items>
              <FlowbiteSidebar.ItemGroup>
                <Rosters />
              </FlowbiteSidebar.ItemGroup>
            </FlowbiteSidebar.Items>
          </div>
        </div>
      </FlowbiteSidebar>
    </div>
  );
};

export default Sidebar;
