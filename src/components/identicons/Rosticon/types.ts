export type Neighbours = {
  top: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
  count: number;
};

export type SemicircleOrientation = "up" | "right" | "down" | "left";
export type QuarterCircleOrientation = "top-left" | "top-right" | "bottom-right" | "bottom-left";

export interface IdenteapotProps {
  seed: string;
  coloredCellLightness?: number;
  emptyCellLightness?: number;
  paletteSize?: number;
  size?: number;
  gridSize?: number;
  patternSize?: number;
  overlap?: number;
}
