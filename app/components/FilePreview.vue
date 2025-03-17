<script setup lang="ts">
const props = defineProps<{
  files: IFile[];
}>();
const { opened, open, limit, prevPage, nextPage } = usePreview();
const file = computed(() => props.files[opened.value]);
watch(opened, () => {
  limit.value = props.files.length;
});
</script>
<template>
  <UModal v-if="opened >= 0" v-model:open="open" fullscreen>
    <template #content>
      <div class="flex flex-row">
        <div class="h-full w-full flex justify-center items-center">
          <Transition name="fade" mode="out-in">
            <div
              v-if="file"
              :key="opened"
              :class="[
                'relative w-full h-full',
                file?.type === 'folder' && 'size-96',
              ]"
            >
              <Thumbnail v-if="file" :file="file!" layout="col" />
            </div>
          </Transition>
        </div>
        <div
          class="min-w-96 w-96 border-l border-neutral-200/70 h-screen bg-neutral-100 flex flex-col"
        >
          <div
            class="h-16 min-h-16 border-b border-neutral-200/70 bg-white w-full flex justify-between items-center px-4"
          >
            <h4>{{ file?.name }}</h4>
            <UButton icon="lucide:x" @click="open = false" />
          </div>
          <div class="grow w-full overflow-auto">
            <FileInfo v-if="file" :file="file" />
          </div>
          <div
            class="h-16 min-h-16 border-t border-neutral-200/70 bg-white w-full flex justify-start items-center px-4"
          >
            <UButton
              v-if="opened > 0"
              @click="prevPage"
              icon="lucide:chevron-left"
            />
            <span class="grow text-center text-sm"
              >{{ opened + 1 }} / {{ limit }}</span
            >
            <UButton
              v-if="opened < limit - 1"
              @click="nextPage"
              icon="lucide:chevron-right"
              class="ml-auto"
            />
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
