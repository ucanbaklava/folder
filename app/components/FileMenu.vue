<script setup>
const route = useRoute();
const { setFavorite, deleteFiles, deleting } = useFileActions();
const { openPublish } = usePublish();
const { openMove } = useMove();
const { openCopy } = useCopy();
const { openRename } = useRename();
const { openShare } = useShare();
const props = defineProps(["file"]);
const emit = defineEmits(["delete"]);
const fileMenuItems = ref([
  [
    {
      label: "Open",
      icon: "lucide:eye",
      type: "link",
      href: `/preview/${props.file.path}`,
      target: "_blank",
      disabled: props.file.type === "folder",
    },
    {
      label: "Open With",
      icon: "lucide:external-link",
      children: [
        {
          label: "Editor",
          icon: "i-lucide-monitor",
          disabled: true,
        },
      ],
    },
    {
      label: props.file.isFavorite
        ? "Remove from Favorites"
        : "Add to Favorites",
      icon: "lucide:star",
      color: props.file.isFavorite && "error",
      onSelect: () => {
        setFavorite(props.file.id, !props.file.isFavorite);
      },
    },
  ],
  [
    {
      label: "Download",
      icon: "i-lucide-download",
      href: `/api/files/${route.params.bucket}/download/${props.file.id}`,
      target: "_blank",
    },
    {
      label: "Rename",
      icon: "lucide:pencil",
      kbds: ["meta", "R"],
      onSelect: () => {
        openRename(props.file);
      },
    },
    {
      label: "Make a Copy",
      icon: "lucide:copy",
      kbds: ["meta", "D"],
      onSelect: () => {
        openCopy(props.file);
      },
    },
  ],
  [
    {
      label: "Share",
      icon: "lucide:user-plus",
      onSelect: () => {
        openShare([props.file]);
      },
    },
    {
      label: "Move to",
      icon: "lucide:folder-input",
      onSelect: () => {
        openMove(props.file);
      },
    },
    {
      label: "Publish",
      icon: "lucide:globe",
      onSelect: () => {
        openPublish(props.file);
      },
    },
    {
      type: "separator",
    },
    {
      label: "Move to Trash",
      icon: "lucide:trash",
      kbds: ["meta", "backspace"],
      onSelect: () => {
        deleteFiles([props.file.id]);
      },
    },
  ],
]);

watch(deleting, (value) => {
  if (!value) {
    emit("delete");
  }
});
</script>
<template>
  <UContextMenu
    :items="fileMenuItems"
    size="xl"
    :ui="{
      content: 'w-64',
      itemLabel: 'text-sm font-light',
      itemLeadingIcon: '*:stroke-[1px]',
      itemTrailingIcon: '*:stroke-[1px]',
      itemTrailingKbdsSize: 'sm',
    }"
  >
    <slot />
  </UContextMenu>
</template>
