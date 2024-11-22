import { createRoot } from "react-dom/client";

import { App } from "@/App";

import "./index.css";

const root = createRoot(document.getElementById("root") as HTMLElement);

if (import.meta.env.MODE === "test") {
  import("@/__mocks__/browser")
    .then(({ worker }) => {
      worker.start();
    })
    .then(() => {
      root.render(<App />);
    });
} else {
  root.render(<App />);
}

// Uncomment if you want to see the Lighthouse report in the console
// import reportWebVitals from './reportWebVitals'
// reportWebVitals(console.log)
