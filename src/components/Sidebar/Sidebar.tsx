import { Sidebar as FlowbiteSidebar } from "flowbite-react";
import type { FC } from "react";
import SidebarRosters from "./SidebarRosters";

const Sidebar: FC = () => {
  return (
    <FlowbiteSidebar aria-label="Sidebar">
      <div className="flex h-full flex-col justify-between py-2">
        <div>
          <FlowbiteSidebar.Items>
            <SidebarRosters />
          </FlowbiteSidebar.Items>
        </div>
      </div>
    </FlowbiteSidebar>
  );
};

export default Sidebar;
