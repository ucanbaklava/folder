<script setup lang="ts">
const { clear, user } = useUserSession();
const signOut = () => {
  clear();
  navigateTo("/auth/signin");
};
const items = ref([
  [
    {
      label: user.value?.name,
      avatar: {
        src: user.value?.avatar,
      },
      type: "label",
    },
  ],
  [
    {
      label: "Logout",
      icon: "i-lucide-log-out",
      onSelect: signOut,
    },
  ],
]);
</script>

<template>
  <div>
    <UDropdownMenu
      :items="items"
      :ui="{
        content: 'w-48',
      }"
    >
      <UAvatar
        :src="user?.avatar"
        :alt="user?.name"
        size="xl"
        class="border border-neutral-200 dark:border-neutral-700"
      />
    </UDropdownMenu>
  </div>
</template>
