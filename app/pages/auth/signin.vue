<script setup lang="ts">
definePageMeta({ layout: "guest" });
useSeoMeta({
  title: "Sign In",
});
</script>

<template>
  <section class="grow flex justify-center items-center">
    <AuthCard
      title="Sign In / Sign Up"
      description="If you don’t have an account, one will be created."
    />
  </section>
</template>
