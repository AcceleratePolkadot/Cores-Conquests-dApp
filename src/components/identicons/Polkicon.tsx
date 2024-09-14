import { Polkicon as W3UXPolkicon } from "@w3ux/react-polkicon";
import { useThemeMode } from "flowbite-react";
import type React from "react";

interface PolkiconProps {
  size?: number | string;
  address: string;
  copy?: boolean;
  colors?: string[];
  outerColor?: string;
  copyTimeout?: number;
}

export const Polkicon: React.FC<PolkiconProps> = ({ outerColor, ...props }) => {
  const { computedMode } = useThemeMode();
  const computedOuterColor = outerColor ?? (computedMode === "light" ? "#f1f5f9" : "#0f172a");

  return <W3UXPolkicon {...props} outerColor={computedOuterColor} />;
};
