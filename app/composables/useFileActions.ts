export const useFileActions = () => {
  const route = useRoute();
  const toast = useToast();
  const deleting = ref(false);
  const settingFavorite = ref();

  const deleteFiles = async (files: string[]) => {
    // TODO: ask for confirmation
    if (deleting.value) return;
    deleting.value = true;
    try {
      const data = await $fetch(`/api/files/${route.params.bucket}/delete`, {
        method: "POST",
        body: JSON.stringify(files),
      });
      if (data?.status === "success") {
        toast.add({
          title: "Success",
          description: "Files deleted",
          color: "success",
        });
      }
    } catch (err) {
      console.error("Error processing files:", err);
    } finally {
      deleting.value = false;
    }
  };

  const downloadFile = (bucket: string, id: string): string => {
    return `/api/files/${bucket}/download/${id}`;
  };

  const setFavorite = async (file: string, add: boolean) => {
    if (settingFavorite.value) return;
    settingFavorite.value = true;
    try {
      const data = await $fetch(`/api/files/${route.params.bucket}/favorite`, {
        method: "POST",
        body: JSON.stringify({ file, add }),
      });
      if (data?.status === "success") {
        toast.add({
          title: "Success",
          description: add ? "Added to Favorites" : "Removed from Favorites",
          color: "success",
        });
      }
    } catch (err) {
      console.error("Error processing files:", err);
    } finally {
      settingFavorite.value = false;
    }
  };
  return {
    deleteFiles,
    deleting,
    downloadFile,
    setFavorite,
    settingFavorite,
  };
};
