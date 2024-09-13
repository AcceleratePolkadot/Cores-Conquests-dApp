import { useSidebarContext } from "@/contexts/SidebarContext";
import { useWebExtensions } from "@/contexts/WebExtensions";
import useDelayedRender from "@/hooks/useDelayedRender";
import ConnectExtensions from "@/layouts/ConnectExtensions";
import clsx from "clsx";
import type React from "react";

const MainContent: React.FC<React.PropsWithChildren> = ({ children }) => {
  const delayedRender = useDelayedRender(500);
  const { isOpenOnSmallScreens: isSidebarOpen } = useSidebarContext();
  const { connectedWebExtensions } = useWebExtensions();

  return (
    <main
      className={clsx(
        "relative min-h-[calc(100vh-64px)] w-full overflow-y-auto bg-gray-50 dark:bg-gray-900",
        isSidebarOpen ? "lg:ml-16" : "lg:ml-64",
      )}
    >
      {connectedWebExtensions.length === 0 ? (
        delayedRender(() => <ConnectExtensions />)
      ) : (
        <>{children}</>
      )}
    </main>
  );
};

export default MainContent;
