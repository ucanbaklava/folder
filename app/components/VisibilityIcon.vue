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
  <Icon
    v-if="visibilityIcons[visibility]"
    :name="visibilityIcons[visibility]"
    class="opacity-70 cursor-pointer ml-auto min-w-4"
  />
</template>
