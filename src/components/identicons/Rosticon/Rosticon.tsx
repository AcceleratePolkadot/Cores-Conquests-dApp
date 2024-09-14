import { useThemeMode } from "flowbite-react";
import type React from "react";
import { useEffect, useState } from "react";
import { generateIdenteapot } from "./identeapots";

import type { RosterId } from "@/contexts/Rosters/types";

interface RosticonProps {
  rosterId: RosterId;
}

const Rosticon: React.FC<RosticonProps & React.HTMLAttributes<HTMLImageElement>> = ({
  rosterId,
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
        <img src={icon} {...props} alt={`Icon for Roster ${rosterId.asHex()}`} />
      )}
    </>
  );
};

export default Rosticon;
