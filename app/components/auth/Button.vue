<script setup lang="ts">
defineProps<{
  provider: "linkedin" | "github" | "google";
  label?: string;
}>();
const providers = {
  github: {
    icon: "logos:github-icon",
    label: "Continue with GitHub",
  },
  google: {
    icon: "logos:google-icon",
    label: "Get started with Google",
  },
  linkedin: {
    icon: "logos:linkedin-icon",
    label: "Get started with Google",
  },
};
</script>
<template>
  <UButton
    v-if="providers[provider]"
    variant="solid"
    color="neutral"
    block
    as-child
  >
    <a :href="`/api/auth/${provider}`">
      <Icon :name="providers[provider].icon" class="size-6 *:fill-white" />
      <span class="ml-2">{{ label || providers[provider].label }}</span>
    </a>
  </UButton>
</template>
