import Home from "@/pages/Home";
import type React from "react";
import { Suspense } from "react";
import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import FlowbiteWrapper from "./components/flowbite-wrapper";

import Providers from "@/Providers";

const App: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Providers>
        <BrowserRouter>
          <Routes>
            <Route element={<FlowbiteWrapper />}>
              <Route path="/" element={<Home />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Providers>
    </Suspense>
  );
};

export default App;
