<script setup lang="ts">
const route = useRoute();
</script>
<template>
  <AppFile v-if="route.params.id" />
</template>
