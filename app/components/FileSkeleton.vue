<script setup lang="ts">
const { dir } = defineProps<{
  dir: "row" | "col";
}>();
</script>
<template>
  <div
    :class="[
      'flex w-full shadow shadow-neutral-400/20 dark:shadow-neutral-800/20',
      dir === 'row' ? 'flex-row' : 'flex-col',
    ]"
  >
    <div
      :class="[
        'aspect-square relative',
        'bg-neutral-50 dark:bg-neutral-800',
        dir === 'row' ? 'w-24' : 'w-full',
      ]"
    >
      <div class="bg-white dark:bg-neutral-950 p-2 w-ful h-full">
        <USkeleton class="w-full h-full" />
      </div>
    </div>
    <div
      :class="[
        'p-4 flex items-center w-full',
        'bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-200',
      ]"
    >
      <div class="grow w-full">
        <USkeleton class="h-4 w-2/3" />
        <USkeleton class="h-3 w-1/3 mt-2" />
      </div>
      <USkeleton class="size-6 rounded-full ml-auto" />
    </div>
  </div>
</template>
