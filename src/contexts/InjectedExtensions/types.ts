import type extensionsMeta from "@w3ux/extension-assets";
import type { ExtensionIcon } from "@w3ux/extension-assets/util";
import type { InjectedExtension } from "polkadot-api/pjs-signer";

export type ExtensionsMetaKey = keyof typeof extensionsMeta;

export type ExtensionName = string;
export type ConnectedExtensions = Record<ExtensionName, InjectedExtension>;
export type Extension = {
  icon: ExtensionIcon;
  id: ExtensionsMetaKey;
} & (typeof extensionsMeta)[ExtensionsMetaKey];

export type Extensions = Record<ExtensionName, Extension>;

export interface InjectedExtensionsContextType {
  extensions: Extensions;
  connectedExtensions: ConnectedExtensions;
  extensionConnected: (extension: ExtensionName) => boolean;
  connectExtension: (extension: ExtensionName) => void;
  disconnectExtension: (extension: ExtensionName) => void;
}
