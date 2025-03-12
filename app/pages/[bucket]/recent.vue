<script setup lang="ts">
const route = useRoute();
const bucket = route.params.bucket;
</script>
<template>
  <AppFiles
    v-if="bucket"
    title="Recently Added or Modified"
    endpoint="recent"
  />
</template>
