import reactiveDotConfig from "@/config/reactive-dot";
import { ChainProvider, ReactiveDotProvider } from "@reactive-dot/react";
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";

import { App } from "@/App";
import FlowbiteThemeWrapper from "@/components/FlowbiteThemeWrapper";

import "./index.css";

const root = createRoot(document.getElementById("root") as HTMLElement);

if (import.meta.env.MODE === "test") {
  import("@/__mocks__/browser")
    .then(({ worker }) => {
      worker.start();
    })
    .then(() => {
      root.render(
        <StrictMode>
          <ReactiveDotProvider config={reactiveDotConfig}>
            <ChainProvider chainId="bloc">
              <Suspense fallback={<div>Loading...</div>}>
                <FlowbiteThemeWrapper>
                  <App />
                </FlowbiteThemeWrapper>
              </Suspense>
            </ChainProvider>
          </ReactiveDotProvider>
        </StrictMode>,
      );
    });
} else {
  root.render(
    <StrictMode>
      <ReactiveDotProvider config={reactiveDotConfig}>
        <ChainProvider chainId="bloc">
          <Suspense fallback={<div>Loading...</div>}>
            <FlowbiteThemeWrapper>
              <App />
            </FlowbiteThemeWrapper>
          </Suspense>
        </ChainProvider>
      </ReactiveDotProvider>
    </StrictMode>,
  );
}

// Uncomment if you want to see the Lighthouse report in the console
// import reportWebVitals from './reportWebVitals'
// reportWebVitals(console.log)
