import { Sidebar as FlowbiteSidebar } from "flowbite-react";
import type { FC } from "react";

const Sidebar: FC = () => {
  return (
    <FlowbiteSidebar aria-label="Sidebar">
      <div className="flex h-full flex-col justify-between py-2">
        <div>
          <FlowbiteSidebar.Items>
            <FlowbiteSidebar.ItemGroup>
              <FlowbiteSidebar.Item className="pointer-events-none p-0 text-base uppercase [&>*:first-child]:px-0">
                <span className="text-gray-500">Sidebar</span>
              </FlowbiteSidebar.Item>
            </FlowbiteSidebar.ItemGroup>
          </FlowbiteSidebar.Items>
        </div>
      </div>
    </FlowbiteSidebar>
  );
};

export default Sidebar;
