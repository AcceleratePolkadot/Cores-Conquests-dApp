import extensions from "@w3ux/extension-assets";
import { type ExtensionArrayListItem, ExtensionIcons } from "@w3ux/extension-assets/util";
import { useExtensionAccounts, useExtensions } from "@w3ux/react-connect-kit";
import { localStorageOrDefault } from "@w3ux/utils";
import clsx from "clsx";
import { Dropdown } from "flowbite-react";
import type React from "react";
import { FaCircleMinus, FaCirclePlus, FaCircleXmark } from "react-icons/fa6";
import { HiViewGrid } from "react-icons/hi";
import { IoLinkSharp } from "react-icons/io5";
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
          <span className="sr-only">Wallet Extensions</span>
          <HiViewGrid className="text-2xl text-gray-500 dark:text-gray-400" />
        </span>
      }
    >
      {installedExtensions.map((webExtension, index) => {
        return (
          <Dropdown.Item
            key={webExtension.id}
            className={clsx({
              "rounded-b-lg": index === installedExtensions.length - 1,
              "rounded-t-lg": index === 0,
            })}
          >
            <Extension extension={webExtension} />
          </Dropdown.Item>
        );
      })}
    </Dropdown>
  );
};

export const ExtensionStatusButton = ({
  status,
  handleToggleConnection,
}: { status: string; handleToggleConnection: () => void }) => {
  let icon: React.ReactNode;

  switch (status) {
    case "connected":
      icon = (
        <button
          type="button"
          className="rounded-md bg-red-500 px-1 py-1.5 text-white text-xs hover:bg-red-700"
        >
          <div className="flex items-center space-x-1">
            <FaCircleMinus />
            <span className="inline-flex flex-shrink-0">Disconnect</span>
          </div>
        </button>
      );
      break;
    case "not_authenticated":
      icon = (
        <button
          type="button"
          className="rounded-md bg-gray-500 px-1 py-1.5 text-white text-xs hover:bg-gray-700"
        >
          <div className="flex items-center space-x-1">
            <FaCircleXmark />
            <span className="inline-flex flex-shrink-0">Not authenticated</span>
          </div>
        </button>
      );
      break;
    default:
      icon = (
        <button
          type="button"
          className="rounded-md bg-green-500 px-1 py-1.5 text-white text-xs hover:bg-green-700"
        >
          <div className="flex items-center space-x-1">
            <FaCirclePlus />
            <span className="inline-flex flex-shrink-0">Connect</span>
          </div>
        </button>
      );
  }

  return (
    <button type="button" onClick={() => handleToggleConnection()}>
      {icon}
    </button>
  );
};

export const Extension = ({ extension }: ExtensionProps) => {
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
    <div className="flex w-full items-center space-x-4">
      <div className="h-12 w-12 flex-none">
        <Icon />
      </div>

      <div className="flex-auto content-left">
        <div className="flex items-center space-x-3">
          <p className="font-semibold text-sm leading-6">{title}</p>
          {connected && (
            <span className="inline-flex flex-shrink-0 items-center text-sm">
              <IoLinkSharp />
            </span>
          )}
        </div>

        <p className="mt-1 text-left text-xs">
          <a href={`https://${websiteUrl}`} target="_blank" rel="noreferrer">
            {websiteText}
          </a>
        </p>
      </div>

      <div className="flex-none">
        <ExtensionStatusButton
          status={extensionsStatus[id]}
          handleToggleConnection={handleToggleConnection}
        />
      </div>
    </div>
  );
};

export default Extensions;
