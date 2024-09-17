import { useInjectedExtensions } from "@/contexts/InjectedExtensions";
import clsx from "clsx";
import { Dropdown, Tooltip } from "flowbite-react";
import type React from "react";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";
import { HiViewGrid } from "react-icons/hi";
import { HiMiniWallet } from "react-icons/hi2";
import type { ExtensionsDropdownItemProps } from "./types";

const ExtensionsDropdown: React.FC = () => {
  const { extensions } = useInjectedExtensions();

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

      {Object.entries(extensions).map(([key, value], index) => {
        return (
          <ExtensionsDropdownItem
            key={key}
            extension={value}
            index={index}
            installedExtensionsLength={Object.keys(extensions).length}
          />
        );
      })}
    </Dropdown>
  );
};

export const ExtensionStatusIcon = ({ connected }: { connected: boolean }) => {
  return connected ? (
    <Tooltip content="Connected" placement="right" animation="duration-500">
      <span className="text-green-500">
        <FaCirclePlus />
      </span>
    </Tooltip>
  ) : (
    <Tooltip content="Disconnected" placement="right" animation="duration-500">
      <span className="text-red-700">
        <FaCircleMinus />
      </span>
    </Tooltip>
  );
};

export const ExtensionsDropdownItem = ({
  extension,
  index,
  installedExtensionsLength,
}: ExtensionsDropdownItemProps) => {
  const { extensionConnected, connectExtension, disconnectExtension } = useInjectedExtensions();

  const { id, title, website } = extension;
  const connected = extensionConnected(id);

  const websiteText = typeof website === "string" ? website : website.text;
  const websiteUrl = typeof website === "string" ? website : website.url;

  // Handle connect and disconnect from extension.
  const handleToggleConnection = async () => {
    if (!connected) {
      await connectExtension(id);
    } else {
      disconnectExtension(id);
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
          <extension.icon />
        </div>

        <div className="flex-auto content-left">
          <div className="flex items-center space-x-3">
            <p className="font-semibold text-sm leading-6">{title}</p>
            <ExtensionStatusIcon connected={connected} />
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

export default ExtensionsDropdown;
