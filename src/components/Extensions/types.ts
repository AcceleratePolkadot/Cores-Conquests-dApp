import type { ExtensionArrayListItem } from "@w3ux/extension-assets/util";

export interface ExtensionsDropdownItemProps {
  extension: ExtensionArrayListItem;
  index: number;
  installedExtensionsLength: number;
}

export interface ExtensionsGridItemProps {
  extension: ExtensionArrayListItem;
}
