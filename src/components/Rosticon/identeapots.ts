// Im vendoring @teapotlabs/identeapots as I want generateIdenteapot more configurable
// https://github.com/teapot-labs/identeapots/
import type {
  IdenteapotProps,
  Neighbours,
  QuarterCircleOrientation,
  SemicircleOrientation,
} from "./types";

/**
 * Generates an identeapot from the provided `seed`.
 * @param seed The seed to use for generating the identeapot.
 * @param salt The salt to use for hashing the seed.
 * @returns The generated identeapot as a data URL.
 */
export const generateIdenteapot = async ({
  seed,
  coloredCellLightness = 60,
  emptyCellLightness = 90,
  paletteSize = 8,
  size = 400,
  gridSize = 9,
  patternSize = 7,
  overlap = 0.5,
}: IdenteapotProps) => {
  const gridCellSize = size / gridSize;
  const padding = (gridSize - patternSize) / 2;

  const hash = await hashString(seed);
  const matrix = getBoolMatrix(hash, patternSize);

  // Create a canvas element for the identicon
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;

  // Get hue for both foreground and background
  const hue = ((Number.parseInt(hash.substring(0, 2), 16) / paletteSize) * 360) % 360;

  // Draw background color
  context.fillStyle = `hsl(${hue}, 70%, ${emptyCellLightness}%)`;
  context.fillRect(0, 0, size, size);

  // Set the fill style for the identicon pattern
  context.fillStyle = `hsl(${hue}, 70%, ${coloredCellLightness}%)`;

  // Draw the identicon pattern
  for (let row = 0; row < patternSize; row++) {
    for (let col = 0; col < patternSize; col++) {
      if (matrix[row][col]) {
        // Calculate the starting point without padding and with overlap
        const startX = (col + padding) * gridCellSize - overlap;
        const startY = (row + padding) * gridCellSize - overlap;
        const cellSize = gridCellSize + 2 * overlap; // Adjusted cell size to avoid gaps

        const neighbors = getNeighbours(matrix, row, col);
        switch (neighbors.count) {
          case 0:
            circle(context, startX, startY, cellSize / 2);
            break;
          case 1:
            if (neighbors.top) {
              semicircleOnRectangle(context, startX, startY, cellSize, "up");
            } else if (neighbors.right) {
              semicircleOnRectangle(context, startX, startY, cellSize, "right");
            } else if (neighbors.bottom) {
              semicircleOnRectangle(context, startX, startY, cellSize, "down");
            } else if (neighbors.left) {
              semicircleOnRectangle(context, startX, startY, cellSize, "left");
            }
            break;
          case 2:
            if ((neighbors.top && neighbors.bottom) || (neighbors.left && neighbors.right)) {
              square(context, startX, startY, cellSize);
            } else if (neighbors.top && neighbors.right) {
              quarterCircle(context, startX, startY, cellSize, "top-right");
            } else if (neighbors.right && neighbors.bottom) {
              quarterCircle(context, startX, startY, cellSize, "bottom-right");
            } else if (neighbors.bottom && neighbors.left) {
              quarterCircle(context, startX, startY, cellSize, "bottom-left");
            } else if (neighbors.left && neighbors.top) {
              quarterCircle(context, startX, startY, cellSize, "top-left");
            }
            break;
          default:
            square(context, startX, startY, cellSize);
            break;
        }
      }
    }
  }

  return canvas.toDataURL();
};

/**
 * Hash a string using MD5 and a salt.
 * @param str The string to hash.
 * @param salt The salt to use for hashing.
 * @returns The hashed string.
 */
export async function hashString(str: string, salt = ""): Promise<string> {
  const msgUint8 = new TextEncoder().encode(str + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

/**
 * Generates a symmetrical boolean 2D matrix of size `size` from the provided `hash`.
 * The matrix is symmetrical along the vertical axis.
 * @param hash The hash to use for generating the matrix.
 * @param size The number of rows and columns in the matrix.
 * @returns The generated matrix.
 */
export function getBoolMatrix(hash: string, size: number): boolean[][] {
  const hashArray = hash.split("");
  const groupSize = Math.ceil(size / 2);
  const matrix: boolean[][] = [];

  for (let i = 0; i < hash.length; i += groupSize) {
    const group = hashArray.slice(i, i + groupSize).map((char) => char.charCodeAt(0) % 2 === 0);
    const mirror = [...group].reverse();
    if (size % 2 !== 0) mirror.shift();
    matrix.push([...group, ...mirror]);

    if (matrix.length === size) break;
  }

  return matrix;
}

/**
 * Get the number of neighbours of a cell in a matrix at the specified row and column.
 * @param matrix The matrix to check.
 * @param row The row of the cell to check.
 * @param col The column of the cell to check.
 * @returns The details of the neighbours of the cell at the specified row and column.
 */
export function getNeighbours(matrix: boolean[][], row: number, col: number): Neighbours {
  const result = { top: false, right: false, bottom: false, left: false, count: 0 };
  if (row < 0 || col < 0 || row >= matrix.length || col >= matrix[0].length) return result;

  result.top = row > 0 && matrix[row - 1][col];
  result.bottom = row < matrix.length - 1 && matrix[row + 1][col];
  result.left = col > 0 && matrix[row][col - 1];
  result.right = col < matrix[0].length - 1 && matrix[row][col + 1];

  result.count = [result.top, result.right, result.bottom, result.left].filter(Boolean).length;

  return result;
}

/**
 * Draws a square on the canvas at the specified x and y coordinates with the specified size.
 * @param context The 2D context of the canvas to draw on.
 * @param x The x coordinate of the left of the square.
 * @param y The y coordinate of the top of the square.
 * @param size The size of the square.
 */
export function square(context: CanvasRenderingContext2D, x: number, y: number, size: number) {
  context.fillRect(x, y, size, size);
}

/**
 * Draw a circle on the canvas at the specified x and y coordinates with the specified radius.
 * @param context The 2D context of the canvas to draw on.
 * @param x The x coordinate of the left of the circle.
 * @param y The y coordinate of the top of the circle.
 * @param radius The radius of the circle.
 */
export function circle(context: CanvasRenderingContext2D, x: number, y: number, radius: number) {
  context.beginPath();
  context.arc(x + radius, y + radius, radius, 0, 2 * Math.PI);
  context.fill();
}

/**
 * Draw a shape on the canvas composed of a rectangle with a semicircle on top at the specified x and y coordinates with the specified size and orientation.
 * @param context The 2D context of the canvas to draw on.
 * @param x The x coordinate of the left of the shape.
 * @param y The y coordinate of the top of the shape.
 * @param size The size of the shape.
 * @param orientation The orientation of the shape.
 */
export function semicircleOnRectangle(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  orientation: SemicircleOrientation,
) {
  context.beginPath();
  if (orientation === "up") {
    context.moveTo(x, y);
    context.lineTo(x + size, y);
    context.lineTo(x + size, y + size / 2);
    context.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI);
  } else if (orientation === "right") {
    context.moveTo(x + size, y);
    context.lineTo(x + size, y + size);
    context.lineTo(x + size / 2, y + size);
    context.arc(x + size / 2, y + size / 2, size / 2, Math.PI / 2, Math.PI * 1.5);
  } else if (orientation === "down") {
    context.moveTo(x + size, y + size);
    context.lineTo(x, y + size);
    context.lineTo(x, y + size / 2);
    context.arc(x + size / 2, y + size / 2, size / 2, Math.PI, Math.PI * 2);
  } else if (orientation === "left") {
    context.moveTo(x, y + size);
    context.lineTo(x, y);
    context.lineTo(x + size / 2, y);
    context.arc(x + size / 2, y + size / 2, size / 2, Math.PI * 1.5, Math.PI * 0.5);
  }
  context.fill();
}

/**
 * Draw a quarter circle on the canvas at the specified x and y coordinates with the specified radius and orientation.
 * @param context The 2D context of the canvas to draw on.
 * @param x The x coordinate of the left of the quarter circle.
 * @param y The y coordinate of the top of the quarter circle.
 * @param radius The radius of the quarter circle.
 * @param orientation The orientation of the quarter circle.
 */
export function quarterCircle(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  orientation: QuarterCircleOrientation,
) {
  context.beginPath();
  if (orientation === "top-left") {
    context.moveTo(x, y);
    context.arc(x, y, radius, 0, Math.PI / 2);
  } else if (orientation === "top-right") {
    context.moveTo(x + radius, y);
    context.arc(x + radius, y, radius, Math.PI / 2, Math.PI);
  } else if (orientation === "bottom-right") {
    context.moveTo(x + radius, y + radius);
    context.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 1.5);
  } else if (orientation === "bottom-left") {
    context.moveTo(x, y + radius);
    context.arc(x, y + radius, radius, Math.PI * 1.5, Math.PI * 2);
  }
  context.fill();
}
