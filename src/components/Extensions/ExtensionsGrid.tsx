import { useWebExtensions } from "@/contexts/WebExtensions";
import type React from "react";

import type { ExtensionsGridItemProps } from "./types";

const ExtensionsGrid: React.FC = () => {
  const { installedWebExtensions } = useWebExtensions();

  return (
    <ul className="flex items-center justify-center space-x-8">
      {installedWebExtensions.map((webExtension) => {
        return <ExtensionsGridItem key={webExtension.id} extension={webExtension} />;
      })}
    </ul>
  );
};

export const ExtensionsGridItem = ({ extension }: ExtensionsGridItemProps) => {
  const {
    webExtensionCanConnect,
    webExtensionConnected,
    webExtensionIcon,
    connectWebExtension,
    disconnectWebExtension,
  } = useWebExtensions();

  const { id, title, website } = extension;

  const canConnect = webExtensionCanConnect(id);
  const connected = webExtensionConnected(id);
  const Icon = webExtensionIcon(id);

  const websiteText = typeof website === "string" ? website : website.text;
  const websiteUrl = typeof website === "string" ? website : website.url;

  // Handle connect and disconnect from extension.
  const handleToggleConnection = async () => {
    if (!connected) {
      if (canConnect) {
        await connectWebExtension(id);
      } else {
        alert("Unable to connect to the extension.");
      }
    } else {
      disconnectWebExtension(id);
    }
  };

  return (
    <li
      key={extension.id}
      className="flex min-w-80 flex-col divide-y divide-gray-200 rounded-lg bg-gray-50 text-center text-gray-900 shadow dark:divide-gray-700 dark:bg-gray-800 dark:text-white dark:shadow-gray-900"
    >
      <div className="flex flex-1 flex-col p-8">
        <div className="mx-auto h-32 w-32 flex-shrink-0 rounded-full">
          <button type="button" onClick={handleToggleConnection}>
            <Icon />
          </button>
        </div>
        <h3 className="mt-6 font-medium text-sm">{title}</h3>
        <p className="mt-1 flex flex-grow flex-col justify-between text-gray-400 dark:text-gray-600">
          <a href={`https://${websiteUrl}`} target="_blank" rel="noreferrer" className="text-sm">
            {websiteText}
          </a>
        </p>
      </div>
      <div className="-mt-px flex">
        <div className="flex w-0 flex-1">
          <button
            type="button"
            className="-mr-px relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-b-lg border border-transparent py-4 font-semibold text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={handleToggleConnection}
          >
            <span className="ml-3">{connected ? "Disconnect" : "Connect"}</span>
          </button>
        </div>
      </div>
    </li>
  );
};

export default ExtensionsGrid;
