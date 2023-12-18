import { Coordinates } from "@/components/DraggableGrid/types/draggable-grid.types";
import { CSSProperties } from "vue/types/jsx";
import { MOUSE_OFFSET } from "@/components/DraggableGrid/consts/draggable-grid.config";

export const makeCellId = ({ x, y }: Coordinates): string => {
  return `${x}_${y}`;
};

export const getCellElement = (coordinates: Coordinates) => {
  return document.getElementById(makeCellId(coordinates));
};

export const getTranslateValue = (pos: number, size: number): number => {
  return pos + Math.floor(size / 2) - 12;
};

export const calculateDotStyles = (
  coordinates: Coordinates,
  parent: Element
): CSSProperties => {
  const element = getCellElement(coordinates);

  if (!element) {
    return {};
  }

  const {
    x: elementX,
    y: elementY,
    height,
    width,
  } = element.getBoundingClientRect();

  const { x: parentX, y: parentY } = parent.getBoundingClientRect();

  const x = elementX - parentX;
  const y = elementY - parentY;

  const vals = {
    translate: ` ${getTranslateValue(x, width)}px ${getTranslateValue(
      y,
      height
    )}px`,
  };

  return vals;
};

export const getOffset = (value: number, boundary: number) => {
  return Math.max(0, Math.min(boundary, value + MOUSE_OFFSET));
};
