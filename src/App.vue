<template>
  <div id="app">
    <div class="grid">
      <span class="grid__top">Кончик вверх</span>

      <span class="grid__left">Скос влево</span>
      <DraggableGrid />

      <span class="grid__right">Скос вправо</span>
      <span class="grid__top">Кончик вправо</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DraggableGrid from "@/components/DraggableGrid/DraggableGrid.vue";

export default defineComponent({
  name: "App",
  components: { DraggableGrid },
});
</script>

<style lang="scss" scoped>
#app {
  min-height: 100dvh;
  background: black;
  display: grid;
  place-items: center;
  color: whitesmoke;
}

.grid {
  width: fit-content;
  display: grid;
  grid-template-columns: 1fr auto 1fr;

  & > span {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px;
  }

  &__top {
    grid-column: span 3;
  }

  &__bottom {
    grid-column: span 3;
  }
}
</style>