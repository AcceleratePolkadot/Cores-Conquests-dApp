import { StrictMode } from "react";

import reactiveDotConfig from "@/config/reactive-dot";
import Home from "@/pages/Home";
import Providers from "@/providers";
import { ChainProvider, ReactiveDotProvider } from "@reactive-dot/react";

const App = () => {
  return (
    <StrictMode>
      <ReactiveDotProvider config={reactiveDotConfig}>
        <ChainProvider chainId="bloc">
          <Providers>
            <Home />
          </Providers>
        </ChainProvider>
      </ReactiveDotProvider>
    </StrictMode>
  );
};

export { App };
