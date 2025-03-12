<script setup lang="ts">
const props = defineProps<{
  title: string;
  description: string;
}>();
</script>
<template>
  <div class="max-w-md w-full flex flex-col items-center gap-6">
    <img src="/logo.png" class="w-30 mx-auto" />
    <p class="text-center text-sm">
      Welcome to the demo version of the app.<br />Please sign up to continue.
    </p>
    <UCard class="w-full">
      <h3 class="font-semibold text-neutral-950">{{ title }}</h3>
      <p class="text-neutral-500 text-sm">{{ description }}</p>
      <div class="flex flex-col gap-4 py-4">
        <AuthButton provider="github" label="Continue with Github" />
        <AuthButton provider="google" label="Continue with Google" />
        <UAlert
          title="Note"
          icon="lucide:message-square-warning"
          color="neutral"
          variant="subtle"
          description="This is a demo version only. Do not upload personal data. Data may be
      erased periodically."
        />
      </div>
    </UCard>
    <span class="text-sm"
      >Host Your
      <a href="https://folder.run" class="text-primary-500">Folder</a></span
    >
  </div>
</template>
