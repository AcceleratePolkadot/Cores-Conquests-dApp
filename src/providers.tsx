import { ActiveAccountProvider } from "@/contexts/ActiveAccount";
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
        <RostersProvider>{children}</RostersProvider>
      </ActiveAccountProvider>
    </Suspense>
  );
};

export default Providers;
