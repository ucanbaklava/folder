<script setup lang="ts">
defineProps<{
  visibility: "public" | "private" | "inherit";
}>();
const visibilityIcons = {
  public: "lucide:globe",
  private: "lucide:lock",
  inherit: "lucide:folder",
};
</script>
<template>
  <UTooltip :text="visibility" arrow placement="top" :delay-duration="0">
    <Icon
      v-if="visibilityIcons[visibility]"
      :name="visibilityIcons[visibility]"
      class="opacity-70 ml-auto min-w-4"
    />
  </UTooltip>
</template>
