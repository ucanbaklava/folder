<script setup lang="ts">
const router = useRouter();
const { bucket, loading } = useBucket();
// buckets is an array of bucket objects redirect to the bucket page
watch(bucket, () => {
  if (bucket.value?.name) {
    router.push(`/${bucket.value.name}`);
  }
});
onMounted(() => {
  if (bucket.value?.name) {
    router.push(`/${bucket.value.name}`);
  }
});
</script>
<template>
  <CreateBucket v-if="!loading && !bucket" />
</template>
