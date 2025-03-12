<script setup>
const bucketName = ref("");
const loading = ref(false);
const error = ref("");
const router = useRouter();

const createBucket = async () => {
  if (!bucketName.value) {
    error.value = "Bucket name is required";
    return;
  }
  if (bucketName.value.length < 6) {
    error.value = "Bucket name must be at least 6 characters";
    return;
  }
  // Validate alphanumeric with optional hyphens (common username pattern)
  // This allows lowercase letters, numbers, and hyphens
  // First character must be a letter, can't end with hyphen
  if (!/^[a-z][a-z0-9-]*[a-z0-9]$/.test(bucketName.value)) {
    error.value =
      "Bucket name must start with a letter and can only contain lowercase letters, numbers, and hyphens";
    return;
  }
  loading.value = true;
  try {
    const data = await $fetch("/api/bucket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: bucketName.value }),
    });
    window.location.reload();
  } catch (errors) {
    if (errors?.data.message) {
      console.error(errors?.data.message);
      error.value = errors.data.message;
    } else {
      error.value = "An error occurred. Please try again.";
    }
    loading.value = false;
  }
};
</script>
<template>
  <div>
    <UCard class="max-w-md mx-auto">
      <template #header>
        <div class="">
          <h4 class="font-semibold">Create Bucket</h4>
          <p class="text-sm">
            Choose a unique bucket name. It can't be changed later.
          </p>
        </div>
      </template>
      <UFormField label="Bucket Name" :error="error">
        <UInput
          v-model="bucketName"
          placeholder="Enter bucket name"
          required
          class="w-full"
          maxlength="20"
        />
      </UFormField>
      <template #footer>
        <UButton
          variant="solid"
          color="primary"
          @click="createBucket"
          :loading="loading"
          >Create Bucket</UButton
        >
      </template>
    </UCard>
  </div>
</template>
