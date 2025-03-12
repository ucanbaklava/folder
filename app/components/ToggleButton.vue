<script setup lang="ts">
export type ToggleButtonItem = { label?: string; value: string; icon: string };

const model = defineModel<string>();

const open = ref(false);
const items = ref<ToggleButtonItem[]>([
  { value: "list", icon: "lucide:menu" },
  { value: "grid", icon: "lucide:grid-2x2" },
  { value: "grid-compact", icon: "lucide:grid-3x3" },
  { value: "table", icon: "lucide:table" },
]);
const active = computed(() =>
  items.value.find((item) => item.value === model.value)
);
watch(model, () => {
  open.value = false;
});
</script>
<template>
  <UPopover v-model:open="open">
    <UButton :icon="active?.icon || 'lucide:grid-2x2'" />
    <template #content>
      <UTabs
        :content="false"
        :items="items"
        v-model="model"
        style="--ui-bg-elevated: transparent"
        size="lg"
        orientation="vertical"
        :ui="{ leadingIcon: '*:stroke-[1px]' }"
      >
      </UTabs>
    </template>
  </UPopover>
</template>
