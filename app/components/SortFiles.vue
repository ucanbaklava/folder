<script setup lang="ts">
const sort = ref({
  sortBy: "createdAt",
  order: "asc",
});
const sortOptions = [
  { value: "name", label: "Name" },
  { value: "updatedAt", label: "Modified" },
  { value: "createdAt", label: "Created" },
];
const emit = defineEmits(["update"]);
watch(
  sort,
  () => {
    emit("update", sort.value);
  },
  { deep: true }
);
</script>
<template>
  <UButtonGroup>
    <UTooltip text="Change Order" :delay-duration="0">
      <UButton
        :icon="
          sort.order === 'asc'
            ? 'lucide:arrow-down-wide-narrow'
            : 'lucide:arrow-up-narrow-wide'
        "
        @click="sort.order = sort.order === 'asc' ? 'desc' : 'asc'"
      />
    </UTooltip>
    <USelect v-model="sort.sortBy" :items="sortOptions" class="w-32" />
  </UButtonGroup>
</template>
