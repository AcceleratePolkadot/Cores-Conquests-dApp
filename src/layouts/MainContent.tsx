import { useAccounts } from "@/contexts/Accounts";
import { useInjectedExtensions } from "@/contexts/InjectedExtensions";
import { useSidebarContext } from "@/contexts/SidebarContext";
import useDelayedRender from "@/hooks/useDelayedRender";
import ConnectExtensions from "@/layouts/ConnectExtensions";
import SelectAccount from "@/layouts/SelectAccount";
import clsx from "clsx";
import type React from "react";

const MainContent: React.FC<React.PropsWithChildren> = ({ children }) => {
  const delayedRender = useDelayedRender(500);
  const { isOpenOnSmallScreens: isSidebarOpen } = useSidebarContext();
  const { connectedExtensions } = useInjectedExtensions();
  const { activeAccount } = useAccounts();

  return (
    <main
      className={clsx(
        "relative min-h-[calc(100vh-64px)] w-full overflow-y-auto bg-gray-50 dark:bg-gray-900",
        isSidebarOpen ? "lg:ml-16" : "lg:ml-64",
      )}
    >
      {Object.keys(connectedExtensions).length === 0 ? (
        delayedRender(() => <ConnectExtensions />)
      ) : activeAccount ? (
        <>{children}</>
      ) : (
        <SelectAccount />
      )}
    </main>
  );
};

export default MainContent;
