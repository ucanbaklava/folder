<script setup lang="ts">
const route = useRoute();
const bucket = route.params.bucket;
</script>
<template>
  <AppFiles v-if="bucket" />
</template>
