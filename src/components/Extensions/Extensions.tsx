import extensions from "@w3ux/extension-assets";
import { type ExtensionArrayListItem, ExtensionIcons } from "@w3ux/extension-assets/util";
import { useExtensionAccounts, useExtensions } from "@w3ux/react-connect-kit";
import { localStorageOrDefault } from "@w3ux/utils";
import clsx from "clsx";
import { Dropdown, Tooltip } from "flowbite-react";
import type React from "react";
import { FaCircleMinus, FaCirclePlus, FaCircleXmark } from "react-icons/fa6";
import { HiViewGrid } from "react-icons/hi";
import { HiMiniWallet } from "react-icons/hi2";
import type { ExtensionProps } from "./types";

const Extensions: React.FC = () => {
  const { extensionInstalled } = useExtensions();
  const UNSUPPORTED_EXTENSIONS = ["metamask-polkadot-snap", "polkagate-snap"];

  const webExtensions = Object.entries(extensions)
    .filter(([key]) => !UNSUPPORTED_EXTENSIONS.includes(key))
    .map(([key, value]) => ({
      id: key,
      ...value,
    }))
    .filter((extension) => extension.category === "web-extension") as ExtensionArrayListItem[];

  const installedExtensions = webExtensions.filter((webExtension) =>
    extensionInstalled(webExtension.id),
  );

  return (
    <Dropdown
      arrowIcon={false}
      dismissOnClick={false}
      inline
      label={
        <span className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
          <span className="sr-only">Web3 Wallet Extensions</span>
          <HiViewGrid className="text-2xl text-gray-500 dark:text-gray-400" />
        </span>
      }
    >
      <Dropdown.Header className="text-center">
        <span className="inline-flex items-baseline">
          <HiMiniWallet className="mx-2 h-5 w-5 self-center rounded-full" />
          <span className="font-semibold text-lg">Extensions</span>
        </span>
      </Dropdown.Header>

      {installedExtensions.map((webExtension, index) => {
        return (
          <Extension
            key={webExtension.id}
            extension={webExtension}
            index={index}
            installedExtensionsLength={installedExtensions.length}
          />
        );
      })}
    </Dropdown>
  );
};

export const ExtensionStatusIcon = ({ status }: { status: string }) => {
  let icon: React.ReactNode;

  switch (status) {
    case "connected":
      icon = (
        <Tooltip content="Connected" placement="right" animation="duration-500">
          <span className="text-green-500">
            <FaCirclePlus />
          </span>
        </Tooltip>
      );
      break;
    case "not_authenticated":
      icon = (
        <Tooltip content="Not Authenticated" placement="right" animation="duration-500">
          <span className="text-gray-600">
            <FaCircleXmark />
          </span>
        </Tooltip>
      );
      break;
    default:
      icon = (
        <Tooltip content="Disconnected" placement="right" animation="duration-500">
          <span className="text-red-700">
            <FaCircleMinus />
          </span>
        </Tooltip>
      );
  }

  return icon;
};

export const Extension = ({ extension, index, installedExtensionsLength }: ExtensionProps) => {
  const { extensionsStatus, extensionCanConnect, extensionInstalled } = useExtensions();
  const { connectExtensionAccounts } = useExtensionAccounts();

  const { id, title, website } = extension;

  const canConnect = extensionCanConnect(id);
  const connected = extensionsStatus[id] === "connected";

  const Icon = ExtensionIcons[id];

  const websiteText = typeof website === "string" ? website : website.text;
  const websiteUrl = typeof website === "string" ? website : website.url;

  // Handle connect and disconnect from extension.
  const handleToggleConnection = async () => {
    if (!connected) {
      if (canConnect) {
        await connectExtensionAccounts(id);
      } else {
        alert("Unable to connect to the extension.");
      }
    } else {
      if (confirm("Are you sure you want to disconnect from this extension?")) {
        const updatedActiveExtensions = (
          localStorageOrDefault("active_extensions", [], true) as string[]
        ).filter((ext: string) => ext !== id);

        localStorage.setItem("active_extensions", JSON.stringify(updatedActiveExtensions));
        location.reload();
      }
    }
  };

  return (
    <Dropdown.Item
      key={extension.id}
      onClick={handleToggleConnection}
      className={clsx({
        "rounded-b-lg": index === installedExtensionsLength - 1,
      })}
    >
      <div className="flex w-full items-center space-x-4">
        <div className="h-12 w-12 flex-none">
          <Icon />
        </div>

        <div className="flex-auto content-left">
          <div className="flex items-center space-x-3">
            <p className="font-semibold text-sm leading-6">{title}</p>
            <ExtensionStatusIcon status={extensionsStatus[id]} />
          </div>

          <p className="mt-1 text-left text-xs">
            <a href={`https://${websiteUrl}`} target="_blank" rel="noreferrer">
              {websiteText}
            </a>
          </p>
        </div>
      </div>
    </Dropdown.Item>
  );
};

export default Extensions;
