import type { ExtensionArrayListItem, ExtensionIcon } from "@w3ux/extension-assets/util";

export interface WebExtensionsContextType {
  webExtensions: ExtensionArrayListItem[];
  installedWebExtensions: ExtensionArrayListItem[];
  connectedWebExtensions: ExtensionArrayListItem[];
  webExtensionInstalled: (id: string) => boolean;
  webExtensionStatus: (id: string) => "connected" | "not_authenticated" | "installed";
  webExtensionCanConnect: (id: string) => boolean;
  webExtensionConnected: (id: string) => boolean;
  webExtensionIcon: (id: string) => ExtensionIcon;
  connectWebExtension: (id: string) => Promise<void>;
  disconnectWebExtension: (id: string) => void;
}
