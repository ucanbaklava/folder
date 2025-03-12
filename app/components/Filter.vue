<script setup lang="ts">
const open = ref(false);
const emit = defineEmits(["update"]);
const defaultValue = {
  drive: false,
  contentType: "",
  visibility: "",
  shared: "",
};
const filters = ref({ ...defaultValue });
const fileTypeOptions = computed(() => {
  return Object.keys(fileIcons).map((key) => ({
    value: key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
    icon: fileIcons[key],
  }));
});
const sharedOptions = [
  { value: "yes", label: "Shared" },
  { value: "no", label: "Not Shared" },
];
const reset = () => {
  filters.value = { ...defaultValue };
  emit("update", null);
};
const onApply = () => {
  emit("update", filters.value);
  open.value = false;
};
</script>
<template>
  <UPopover arrow v-model:open="open">
    <UButton icon="lucide:filter" class="ml-auto" />
    <template #content>
      <div class="flex flex-col gap-4 p-4 w-48">
        <USwitch v-model="filters.drive" label="Entire Drive" />
        <USelect
          placeholder="File Type"
          v-model="filters.contentType"
          :items="fileTypeOptions"
          variant="outline"
        />
        <USelect
          placeholder="Visibility"
          v-model="filters.visibility"
          :items="['public', 'private']"
          variant="outline"
        />
        <USelect
          placeholder="Sharing"
          v-model="filters.shared"
          :items="sharedOptions"
          variant="outline"
        />
        <div class="flex flex-row items-center justify-between gap-2">
          <UButton color="primary" variant="solid" @click="onApply">
            Apply
          </UButton>
          <UButton @click="reset" color="primary"> Reset </UButton>
        </div>
      </div>
    </template>
  </UPopover>
</template>
