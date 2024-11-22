import { StrictMode } from "react";

import FlowbiteThemeWrapper from "@/components/FlowbiteThemeWrapper";
import reactiveDotConfig from "@/config/reactive-dot";
import Home from "@/pages/Home";
import Providers from "@/providers";
import { ChainProvider, ReactiveDotProvider } from "@reactive-dot/react";

const App = () => {
  return (
    <StrictMode>
      <FlowbiteThemeWrapper>
        <ReactiveDotProvider config={reactiveDotConfig}>
          <ChainProvider chainId="bloc">
            <Providers>
              <Home />
            </Providers>
          </ChainProvider>
        </ReactiveDotProvider>
      </FlowbiteThemeWrapper>
    </StrictMode>
  );
};

export { App };
