<script setup lang="ts">
import { formatTimeAgo } from "@vueuse/core";
const { file, dir, selected } = defineProps<{
  file: IFile;
  dir: "row" | "col";
  selected: boolean;
}>();
const emit = defineEmits(["select", "open", "delete"]);
const summary = computed(() => {
  let text = file.type;
  if (file.size) text += " / " + formatBytes(file.size as number);
  if (file.dimensions) text += " / " + file.dimensions;
  return text;
});
</script>
<template>
  <FileMenu :file="file" @delete="emit('delete')">
    <div
      :class="[
        'flex w-full shadow shadow-neutral-400/20 dark:shadow-neutral-800/20',
        dir === 'row' ? 'flex-row' : 'flex-col',
      ]"
      @click.stop="!file.deletedAt && emit('select', file.id)"
      @dblclick="!file.deletedAt && emit('open', file.id)"
    >
      <div
        :class="[
          'aspect-square relative',
          selected
            ? 'bg-primary-100 dark:bg-primary-800'
            : 'bg-neutral-50 dark:bg-neutral-800',
          dir === 'row' ? 'w-24' : 'w-full',
        ]"
      >
        <Thumbnail :file="file" :layout="dir" />
      </div>
      <div
        :class="[
          'p-4 flex gap-2 items-center w-full grow',
          selected
            ? 'bg-primary-500 text-white'
            : 'bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-200',
        ]"
      >
        <div class="grow w-full">
          <div class="text-sm font-semibold break-all line-clamp-2">
            {{ file.name }}
          </div>
          <div class="text-xs uppercase opacity-70 break-all line-clamp-1">
            {{ summary }}
          </div>
          <div
            v-if="file.deletedAt"
            class="text-xs uppercase opacity-70 break-all line-clamp-1 text-right"
          >
            {{ formatTimeAgo(new Date(file.deletedAt)) }}
          </div>
        </div>
        <template v-if="!file.deletedAt">
          <Icon
            v-if="file.sharedCount"
            name="lucide:users"
            class="opacity-70 mr-2 min-w-4"
          />
          <VisibilityIcon :visibility="file.visibility" />
        </template>
      </div>
    </div>
  </FileMenu>
</template>
