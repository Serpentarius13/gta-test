<template>
  <div :style="gridStyles" class="draggable-grid" @mouseover="handleMouseMove">
    <div v-for="x in xArray" :key="x">
      <div
        v-for="y in yArray"
        :id="makeCellId({ x, y })"
        :key="y"
        class="draggable-grid__cell"
        @drop="handleDrop({ x, y })"
        @dragenter.prevent
        @dragover.prevent
      />
    </div>

    <div
      :id="DRAGGABLE_DOT_ID"
      :draggable="true"
      :style="{ ...baseDotStyles, ...currentDotStyles }"
      class="draggable-grid__dot"
      @drag="startDragging"
      @dragend="leaveDragging"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { CSSProperties } from "vue/types/jsx";
import { Coordinates } from "@/components/DraggableGrid/types/draggable-grid.types";
import {
  calculateDotStyles,
  getOffset,
  makeCellId,
} from "@/components/DraggableGrid/utils/draggable-grid.utils";

import {
  BALL_SIZE,
  CELL_SIZE,
  CELLS,
  DEFAULT_COORDINATES,
  DRAGGABLE_DOT_ID,
} from "@/components/DraggableGrid/consts/draggable-grid.config";

interface Data {
  CELLS: number;
  CELL_SIZE: number;
  BALL_SIZE: number;
  DRAGGABLE_DOT_ID: string;
  coordinates: Coordinates;
  mouseCoordinates: Coordinates | null;
  isDragging: boolean;
  hasMounted: boolean;
}

export default defineComponent({
  components: {},
  data(): Data {
    return {
      CELLS,
      CELL_SIZE,
      BALL_SIZE,
      DRAGGABLE_DOT_ID,
      coordinates: DEFAULT_COORDINATES,

      mouseCoordinates: null,
      isDragging: false,
      hasMounted: false,
    };
  },

  mounted() {
    document.addEventListener("dragstart", this.removeDragShadow);

    this.applyBasicStyles();
  },

  beforeUnmount() {
    document.removeEventListener("dragstart", this.removeDragShadow);
  },

  methods: {
    makeCellId,

    applyBasicStyles() {
      const styles = calculateDotStyles(this.coordinates, this.$el);

      const dot = document.getElementById(this.DRAGGABLE_DOT_ID);

      if (!dot) return;

      Object.entries(styles).forEach(([key, value]) => {
        dot.style[key as any] = value;
      });
    },
    removeDragShadow(event: DragEvent) {
      if (event.dataTransfer) {
        event.dataTransfer.setDragImage(document.createElement("div"), 0, 0);
      }
    },

    startDragging(event: DragEvent) {
      this.applyMousePosition(event);

      this.isDragging = true;
    },
    leaveDragging() {
      this.isDragging = false;
      this.mouseCoordinates = null;
    },

    applyMousePosition(event: MouseEvent) {
      const { clientX, clientY } = event;

      const { left: gridLeft, top: gridTop } = this.$el.getBoundingClientRect();

      const x = clientX - gridLeft;
      const y = clientY - gridTop;

      this.mouseCoordinates = {
        x,
        y,
      };
    },

    handleDrop(coordinates: Coordinates) {
      this.coordinates = coordinates;
      this.isDragging = false;
      console.warn(`Координаты -> X: ${coordinates.x}, Y: ${coordinates.y}`);
    },

    handleMouseMove(event: MouseEvent) {
      if (this.isDragging) {
        this.applyMousePosition(event);
      }
    },
  },

  computed: {
    gridStyles(): CSSProperties {
      const size = this.CELLS * this.CELL_SIZE;
      return {
        gridTemplateColumns: `repeat(${this.CELLS}, 1fr)`,
        width: `${size}px`,
      };
    },
    cellsInQuarter(): number {
      return this.CELLS / 2;
    },

    maxBoundary(): number {
      return this.CELLS * this.CELL_SIZE - this.BALL_SIZE - 4;
    },

    baseDotStyles(): CSSProperties {
      return {
        transition: this.isDragging ? "none" : "all 0.3s ease",
      };
    },

    currentDotStyles(): CSSProperties {
      const MAX_BOUNDARY = this.maxBoundary;

      if (
        this.isDragging &&
        this.mouseCoordinates &&
        this.mouseCoordinates.x > 0 &&
        this.mouseCoordinates.y > 0
      ) {
        const { x, y } = this.mouseCoordinates;

        return {
          translate: `${getOffset(x, MAX_BOUNDARY)}px ${getOffset(
            y,
            MAX_BOUNDARY
          )}px`,
        };
      }

      return calculateDotStyles(this.coordinates, this.$el);
    },

    xArray(): number[] {
      const arr = [];

      for (let i = 0; i < this.CELLS; i++) {
        const isOver = i >= this.cellsInQuarter;
        const value = i - this.cellsInQuarter;
        const pushable = isOver ? value + 1 : value;
        arr.push(pushable);
      }

      return arr;
    },
    yArray(): number[] {
      const arr = [];

      for (let i = 0; i < this.CELLS; i++) {
        const isOver = i >= this.cellsInQuarter;
        const value = this.cellsInQuarter - i;

        const pushable = isOver ? value - 1 : value;

        arr.push(pushable);
      }

      return arr;
    },
  },
});
</script>

<style lang="scss" scoped>
.draggable-grid {
  display: grid;
  overflow: hidden;
  border: 2px solid $color_primary;
  border-radius: 12px;
  position: relative;
  pointer-events: all;

  &__dot {
    --_width: v-bind(BALL_SIZE);
    width: calc(var(--_width) * 1px);
    aspect-ratio: 1;
    border-radius: 50%;
    background: $color_primary;
    position: absolute;
    left: 0;
    top: 0;
    cursor: grab;
    user-select: none;

    &:active {
      cursor: move;
    }
  }

  &__cell {
    aspect-ratio: 1;
    outline: 1px solid $color_primary;
  }
}
</style>