import type { Extension } from "@/contexts/InjectedExtensions/types";

export interface ExtensionsDropdownItemProps {
  extension: Extension;
  index: number;
  installedExtensionsLength: number;
}

export interface ExtensionsGridItemProps {
  extension: Extension;
}
