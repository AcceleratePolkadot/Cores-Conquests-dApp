import { useThemeMode } from "flowbite-react";
import type React from "react";
import { useEffect, useState } from "react";
import { generateIdenteapot } from "./identeapots";

import clsx from "clsx";

import type { RosterId } from "@/contexts/Rosters/types";

interface RosticonProps {
  rosterId: RosterId;
  rounded?: boolean;
  copy?: boolean;
}

const Rosticon: React.FC<RosticonProps & React.HTMLAttributes<HTMLImageElement>> = ({
  rosterId,
  rounded = true,
  copy = false,
  ...props
}) => {
  const { computedMode } = useThemeMode();
  const [icon, setIcon] = useState<string | undefined>(undefined);
  const [coloredCellLightness, setColoredCellLightness] = useState<number>(60);
  const [emptyCellLightness, setEmptyCellLightness] = useState<number>(90);

  useEffect(() => {
    setColoredCellLightness(computedMode === "light" ? 60 : 30);
    setEmptyCellLightness(computedMode === "light" ? 90 : 60);
  }, [computedMode]);

  useEffect(() => {
    const generateIcon = async () => {
      const identicon = await generateIdenteapot({
        seed: rosterId.asHex(),
        coloredCellLightness,
        emptyCellLightness,
      });
      setIcon(identicon);
    };
    generateIcon();
  }, [rosterId, coloredCellLightness, emptyCellLightness]);

  return (
    <>
      {icon !== undefined && (
        <CopyWrapper copy={copy} rosterId={rosterId}>
          <img
            src={icon}
            {...props}
            alt={`Icon for Roster ${rosterId.asHex()}`}
            className={clsx(props.className, { "rounded-full": rounded })}
          />
        </CopyWrapper>
      )}
    </>
  );
};

const CopyWrapper: React.FC<{
  copy: boolean;
  rosterId: RosterId;
  children: React.ReactNode;
}> = ({ copy, rosterId, children }) => {
  const [copySuccess, setCopySuccess] = useState(true);

  useEffect(() => {
    if (copy && !copySuccess) {
      setTimeout(() => {
        setCopySuccess(true);
      }, 200);
    }
  }, [copy, copySuccess]);

  const handleCopy = () => {
    navigator.clipboard.writeText(rosterId.asHex());
    setCopySuccess(false);
  };

  return copy ? (
    <button
      type="button"
      onClick={handleCopy}
      className={clsx(!copySuccess ? "cursor-none" : "cursor-copy")}
    >
      {children}
    </button>
  ) : (
    <>{children}</>
  );
};

export default Rosticon;
