import extensions from "@w3ux/extension-assets";
import { type ExtensionArrayListItem, ExtensionIcons } from "@w3ux/extension-assets/util";
import { useExtensionAccounts, useExtensions } from "@w3ux/react-connect-kit";
import { localStorageOrDefault } from "@w3ux/utils";
import type React from "react";
import { type ReactNode, createContext, useContext, useEffect, useState } from "react";
import type { WebExtensionsContextType } from "./types";

const WebExtensionsContext = createContext<WebExtensionsContextType | undefined>(undefined);

export const useWebExtensions = () => {
  const context = useContext(WebExtensionsContext);
  if (!context) {
    throw new Error("useWebExtensions must be used within a WebExtensionsProvider");
  }
  return context;
};

export const WebExtensionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { extensionsStatus, extensionCanConnect, extensionInstalled } = useExtensions();
  const { connectExtensionAccounts } = useExtensionAccounts();
  const [webExtensions, setWebExtensions] = useState<ExtensionArrayListItem[]>([]);
  const [installedWebExtensions, setInstalledWebExtensions] = useState<ExtensionArrayListItem[]>(
    [],
  );
  const [connectedWebExtensions, setConnectedWebExtensions] = useState<ExtensionArrayListItem[]>(
    [],
  );
  const UNSUPPORTED_EXTENSIONS = ["metamask-polkadot-snap", "polkagate-snap"];

  useEffect(() => {
    const webExtensions = Object.entries(extensions)
      .filter(([key]) => !UNSUPPORTED_EXTENSIONS.includes(key))
      .map(([key, value]) => ({
        id: key,
        ...value,
      }))
      .filter((extension) => extension.category === "web-extension") as ExtensionArrayListItem[];

    setWebExtensions(webExtensions);
  }, []);

  useEffect(() => {
    const installedWebExtensions = webExtensions.filter((webExtension) =>
      extensionInstalled(webExtension.id),
    );

    setInstalledWebExtensions(installedWebExtensions);
  }, [webExtensions, extensionInstalled]);

  useEffect(() => {
    const connectedWebExtensions = installedWebExtensions.filter((webExtension) =>
      webExtensionConnected(webExtension.id),
    );

    setConnectedWebExtensions(connectedWebExtensions);
  }, [installedWebExtensions]);

  const webExtensionStatus = (id: string) => {
    return extensionsStatus[id];
  };

  const webExtensionInstalled = (id: string) => {
    return extensionInstalled(id);
  };

  const webExtensionCanConnect = (id: string) => {
    return extensionCanConnect(id);
  };

  const webExtensionConnected = (id: string) => {
    return webExtensionStatus(id) === "connected";
  };

  const webExtensionIcon = (id: string) => {
    return ExtensionIcons[id];
  };

  const connectWebExtension = async (id: string) => {
    await connectExtensionAccounts(id);
  };

  const disconnectWebExtension = (id: string) => {
    if (confirm("Are you sure you want to disconnect from this extension?")) {
      const updatedActiveExtensions = (
        localStorageOrDefault("active_extensions", [], true) as string[]
      ).filter((ext: string) => ext !== id);

      localStorage.setItem("active_extensions", JSON.stringify(updatedActiveExtensions));
      location.reload();
    }
  };

  return (
    <WebExtensionsContext.Provider
      value={{
        webExtensions,
        installedWebExtensions,
        connectedWebExtensions,
        webExtensionInstalled,
        webExtensionStatus,
        webExtensionCanConnect,
        webExtensionConnected,
        webExtensionIcon,
        connectWebExtension,
        disconnectWebExtension,
      }}
    >
      {children}
    </WebExtensionsContext.Provider>
  );
};
