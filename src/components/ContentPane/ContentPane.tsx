import type React from "react";

const ContentPane: React.FC = () => {
  return (
    <main className="relative ml-64 min-h-[calc(100vh-64px)] w-full overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900">
      <h1 className="font-semibold text-2xl text-gray-900 dark:text-white">Content Pane</h1>
    </main>
  );
};

export default ContentPane;
