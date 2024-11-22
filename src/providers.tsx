import { ActiveAccountProvider } from "@/contexts/ActiveAccount";
import { NominationsProvider } from "@/contexts/Nominations";
import { RostersProvider } from "@/contexts/Rosters";
import type React from "react";
import { Suspense } from "react";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ActiveAccountProvider>
        <RostersProvider>
          <NominationsProvider>{children}</NominationsProvider>
        </RostersProvider>
      </ActiveAccountProvider>
    </Suspense>
  );
};

export default Providers;
