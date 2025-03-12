<script setup lang="ts">
const { file, layout } = defineProps<{
  file: IFile;
  layout: "row" | "col";
}>();
</script>
<template>
  <template
    v-if="file.type === 'folder' && file.preview"
    :src="getPreviewUrl(file.preview)"
    alt="preview"
    class="absolute inset-0 w-full h-full object-contain"
  >
    <div class="grid grid-cols-2 grid-rows-2 gap-0.5 p-0.5">
      <img
        :src="getPreviewUrl(file.preview)"
        alt="preview"
        class="w-full aspect-square object-cover"
      />
      <img
        :src="getPreviewUrl(file.preview)"
        alt="preview"
        class="w-full aspect-square object-cover"
      />
      <img
        :src="getPreviewUrl(file.preview)"
        alt="preview"
        class="w-full aspect-square object-cover"
      />
      <div
        v-if="file.count && file.count > 3"
        :class="[
          'w-full aspect-square flex justify-center items-center font-light text-neutral-400 dark:text-neutral-700',
          layout === 'col' ? 'text-3xl' : 'text-lg',
        ]"
      >
        +{{ file.count - 3 }}
      </div>
    </div>
  </template>
  <img
    v-else-if="file.preview"
    :src="getPreviewUrl(file.preview)"
    alt="preview"
    class="absolute inset-0 w-full h-full object-contain"
  />
  <div
    v-else
    class="absolute inset-0 w-full h-full flex justify-center items-center"
  >
    <Icon :name="fileIcon(file.type)" class="size-24" />
  </div>
</template>
