<script setup lang="ts">
const route = useRoute();
const { aside } = useAside();

const items = ref([
  [
    {
      label: "Home",
      icon: "lucide:home",
      to: `/${route.params.bucket}/`,
    },
    {
      label: "Recent",
      icon: "lucide:clock",
      to: `/${route.params.bucket}/recent`,
    },
    {
      label: "Favorites",
      icon: "lucide:star",
      to: `/${route.params.bucket}/favorites`,
    },
  ],
  [
    {
      label: "Shared With Me",
      icon: "lucide:circle-user",
      to: `/${route.params.bucket}/shared`,
    },
    {
      label: "Published",
      icon: "lucide:globe",
      to: `/${route.params.bucket}/published`,
    },
  ],
  [
    {
      label: "Trash",
      icon: "lucide:trash",
      to: `/${route.params.bucket}/trash`,
    },
  ],
]);
</script>

<template>
  <div
    :class="[
      'border-r border-neutral-100 dark:border-neutral-700/50 h-screen px-4 pt-24 pb-12 fixed top-0 bottom-0 left-0 z-8 bg-white dark:bg-neutral-950 overflow-hidden transition-all duration-200 ease-in-out',
      aside ? 'translate-x-0' : '-translate-x-full',
    ]"
  >
    <div class="flex flex-col gap-4 h-full">
      <UNavigationMenu
        orientation="vertical"
        :items="items"
        class="data-[orientation=vertical]:w-48"
      />
      <div class="grow flex items-end justify-center">
        <Usage />
      </div>
    </div>
  </div>
</template>
