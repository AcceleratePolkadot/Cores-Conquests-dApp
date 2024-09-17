import extensionsMeta from "@w3ux/extension-assets";
import { ExtensionIcons } from "@w3ux/extension-assets/util";
import { connectInjectedExtension, getInjectedExtensions } from "polkadot-api/pjs-signer";
import type React from "react";
import { type ReactNode, createContext, useContext, useEffect, useState } from "react";
import type {
  ConnectedExtensions,
  ExtensionName,
  Extensions,
  ExtensionsMetaKey,
  InjectedExtensionsContextType,
} from "./types";

const InjectedExtensionsContext = createContext<InjectedExtensionsContextType | undefined>(
  undefined,
);

export const useInjectedExtensions = () => {
  const context = useContext(InjectedExtensionsContext);
  if (!context) {
    throw new Error("useInjectedExtensions must be used within a InjectedExtensionsProvider");
  }
  return context;
};

export const InjectedExtensionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [extensions, setExtensions] = useState<Extensions>({});
  const [injectedExtensions] = useState<ExtensionName[]>(
    getInjectedExtensions() as ExtensionName[],
  );
  const [connectedExtensions, setConnectedExtensions] = useState<ConnectedExtensions>({});

  useEffect(() => {
    const newExtensions: Extensions = {};
    for (const id of injectedExtensions) {
      if (id in extensionsMeta) {
        newExtensions[id] = {
          ...extensionsMeta[id as ExtensionsMetaKey],
          id: id as ExtensionsMetaKey,
          icon: ExtensionIcons[id],
        };
      }
    }
    setExtensions(newExtensions);
  }, [injectedExtensions]);

  const connectExtension = async (extension: ExtensionName) => {
    if (extension in connectedExtensions) return; // already connected

    const connected = await connectInjectedExtension(extension);
    setConnectedExtensions((prev) => ({ ...prev, [extension]: connected }));
  };

  const disconnectExtension = (extension: ExtensionName) => {
    if (!(extension in connectedExtensions)) return; // not connected

    connectedExtensions[extension].disconnect();
    setConnectedExtensions((prevConnectedExtensions) => {
      const newConnectedExtensions = { ...prevConnectedExtensions };
      delete newConnectedExtensions[extension];
      return newConnectedExtensions;
    });
  };

  const extensionConnected = (extension: ExtensionName) => {
    return extension in connectedExtensions;
  };

  return (
    <InjectedExtensionsContext.Provider
      value={{
        extensions,
        connectedExtensions,
        extensionConnected,
        connectExtension,
        disconnectExtension,
      }}
    >
      {children}
    </InjectedExtensionsContext.Provider>
  );
};
