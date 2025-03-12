<script setup lang="ts">
const props = defineProps<{
  file: IFile;
  loading: boolean;
  error: string;
}>();
const name = ref<string>(props.file.name);
const emit = defineEmits(["submit"]);
const onSubmit = () => {
  emit("submit", name.value);
};
</script>
<template>
  <UModal
    :title="`Rename ${file.name} ${file.type}`"
    :description="`Change the name of ${file.name}`"
  >
    <template #body>
      <UAlert
        v-if="error"
        title="Error"
        :description="error"
        color="error"
        variant="soft"
        icon="lucide:message-circle-warning"
        class="mb-4"
      />
      <UFormField :label="`New ${file.type} name`" class="w-full">
        <UInput v-model="name" class="w-full" />
      </UFormField>
    </template>
    <template #footer>
      <UButton
        v-if="name"
        @click="onSubmit"
        :loading="loading"
        color="primary"
        variant="solid"
        >Update</UButton
      >
    </template>
  </UModal>
</template>
