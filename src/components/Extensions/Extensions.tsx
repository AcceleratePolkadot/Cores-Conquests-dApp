import extensions from "@w3ux/extension-assets";
import { type ExtensionArrayListItem, ExtensionIcons } from "@w3ux/extension-assets/util";
import { useExtensionAccounts, useExtensions } from "@w3ux/react-connect-kit";
import { localStorageOrDefault } from "@w3ux/utils";
import type React from "react";
import type { ExtensionProps } from "./types";

import { FaCircleMinus, FaCirclePlus, FaCircleXmark } from "react-icons/fa6";
import { IoLinkSharp } from "react-icons/io5";

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

  return (
    <ul className="divide-y divide-gray-100 px-4">
      {webExtensions.map(
        (webExtension) =>
          extensionInstalled(webExtension.id) && (
            <li key={webExtension.id} className="flex items-center justify-between gap-x-6 py-5">
              <Extension extension={webExtension} />
            </li>
          ),
      )}
    </ul>
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
        <>
          <FaCircleMinus />
        </>
      );
      break;
    case "not_authenticated":
      icon = (
        <>
          <FaCircleXmark />
        </>
      );
      break;
    default:
      icon = (
        <>
          <FaCirclePlus />
        </>
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

  const isInstalled = extensionInstalled(id);
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
    <>
      <div className="flex min-w-0 gap-x-4">
        <span className="h-12 w-12 flex-none">
          <Icon />
        </span>

        <div className="min-w-0 flex-auto">
          <div className="flex items-center space-x-3">
            <h3 className="font-semibold text-gray-900 text-sm leading-6">{title}</h3>
            {connected && (
              <span className="inline-flex flex-shrink-0 items-center text-sm">
                <IoLinkSharp />
              </span>
            )}
          </div>
          <p className="mt-1 truncate text-gray-500 text-xs leading-5">
            <a href={`https://${websiteUrl}`} target="_blank" rel="noreferrer">
              {websiteText}
            </a>
          </p>
        </div>
      </div>
      {isInstalled && (
        <ExtensionStatusButton
          status={extensionsStatus[id]}
          handleToggleConnection={handleToggleConnection}
        />
      )}
    </>
  );
};

export default Extensions;
