<script setup>
const route = useRoute();
const { data, status, error } = useFetch(
  `/api/files/${route.params.bucket}/folders/`
);
defineEmits(["select"]);
</script>
<template>
  <div class="max-h-48 overflow-y-auto">
    <UTree
      v-if="data"
      :items="data"
      @update:modelValue="$emit('select', $event)"
    />
  </div>
</template>
