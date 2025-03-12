<script setup lang="ts">
const props = defineProps<{
  name: string;
  loading: boolean;
}>();
const gridLayout = {
  "grid-compact": "grid-cols-2 md:grid-cols-6 gap-6",
  grid: "grid-cols-2 md:grid-cols-4 gap-8",
  list: "md:grid-cols-1 gap-4",
  table: "md:grid-cols-4 gap-4",
};
const dir = computed(() =>
  ["list", "table"].includes(props.name) ? "row" : ("col" as "row" | "col")
);
</script>
<template>
  <div :class="['grid w-full', gridLayout[name as keyof typeof gridLayout]]">
    <slot :dir="dir" />
    <template v-if="loading">
      <FileSkeleton v-for="i of 12" :key="i" :dir="dir" />
    </template>
  </div>
</template>
