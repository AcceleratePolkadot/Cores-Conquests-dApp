import Home from "@/pages/Home";
import { ExtensionAccountsProvider, ExtensionsProvider } from "@w3ux/react-connect-kit";
import type React from "react";
import { Suspense } from "react";

import { AccountsProvider } from "@/contexts/Accounts";

const App: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExtensionsProvider>
        <ExtensionAccountsProvider network="polkadot" dappName="Cores and Conquests">
          <AccountsProvider>
            <Home />
          </AccountsProvider>
        </ExtensionAccountsProvider>
      </ExtensionsProvider>
    </Suspense>
  );
};

export default App;
