import { ExtensionsGrid } from "@/components/Extensions";
import type React from "react";

const ConnectExtensions: React.FC = () => {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
      <div className="w-full max-w-6xl px-4 py-8">
        <h2 className="mb-8 text-center font-bold text-2xl text-gray-400 uppercase dark:text-gray-600">
          Connect a Wallet to begin
        </h2>
        <ExtensionsGrid />
      </div>
    </div>
  );
};

export default ConnectExtensions;
