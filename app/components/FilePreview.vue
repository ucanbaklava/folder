<script setup lang="ts">
const props = defineProps<{
  files: IFile[];
}>();
const { opened, open, limit, prevPage, nextPage } = usePreview();
limit.value = props.files.length;
const file = computed(() => props.files[opened.value]);
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
            class="h-16 border-b border-neutral-200/70 bg-white w-full flex justify-between items-center px-4"
          >
            <h4>{{ file?.name }}</h4>
            <UButton icon="lucide:x" @click="open = false" />
          </div>
          <div class="grow w-full">
            <div
              class="flex flex-col items-start justify-start gap-4 h-full p-6"
            >
              <div>
                <div class="text-neutral-950 text-xs font-semibold uppercase">
                  File Path
                </div>
                <div class="text-neutral-700 font-light">
                  {{ file?.path }}
                </div>
              </div>
              <div>
                <div class="text-neutral-950 text-xs font-semibold uppercase">
                  File Size
                </div>
                <div class="text-neutral-700 font-light">
                  {{ formatBytes(file?.size) }}
                </div>
              </div>
              <div>
                <div class="text-neutral-950 text-xs font-semibold uppercase">
                  Type
                </div>
                <div class="text-neutral-700 font-light">{{ file?.type }}</div>
              </div>
              <div>
                <div class="text-neutral-950 text-xs font-semibold uppercase">
                  Content Type
                </div>
                <div class="text-neutral-700 font-light">
                  {{ file?.contentType }}
                </div>
              </div>
              <div>
                <div class="text-neutral-950 text-xs font-semibold uppercase">
                  Visibility
                </div>
                <div class="text-neutral-700 font-light">
                  {{ file?.visibility }}
                </div>
              </div>
              <div>
                <div class="text-neutral-950 text-xs font-semibold uppercase">
                  Added On
                </div>
                <div class="text-neutral-700 font-light">
                  {{ file?.createdAt }}
                </div>
              </div>
              <div v-if="file?.updatedAt !== file?.createdAt">
                <div class="text-neutral-950 text-xs font-semibold uppercase">
                  Modified On
                </div>
                <div class="text-neutral-700 font-light">
                  {{ file?.updatedAt }}
                </div>
              </div>
            </div>
          </div>
          <div
            class="h-16 border-t border-neutral-200/70 bg-white w-full flex justify-start items-center px-4"
          >
            <UButton
              v-if="opened > 0"
              @click="prevPage"
              icon="lucide:chevron-left"
            />
            <span class="grow text-center text-sm"
              >{{ opened + 1 }} / {{ files.length }}</span
            >
            <UButton
              v-if="opened < files.length - 1"
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
