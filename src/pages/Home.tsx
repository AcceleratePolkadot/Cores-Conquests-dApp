import logo from "@/assets/logo.svg"; // Adjust the import path as needed
import Extensions from "@/components/Extensions";
import type React from "react";

import Accounts from "@/components/Accounts";

const Home: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <img src={logo} alt="Logo" className="h-8 w-auto" />
        </div>
        <nav className="mt-5">
          <Extensions />
          <Accounts />
        </nav>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <h1 className="font-semibold text-2xl text-gray-900">Home</h1>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <h1>Main page</h1>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
