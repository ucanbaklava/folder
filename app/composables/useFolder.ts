export const useFolder = () => {
  type Folder = {
    id: string;
    name: string;
    path: string;
    parentId?: string;
    breadcrumb?: FolderBreadcrumb[];
  };
  const route = useRoute();
  const folder = useState<Folder | null>("folder", () => null);
  const loading = useState<boolean>("folder-loading", () => false);

  const fetchFolder = async () => {
    if (!route.params.bucket) return;
    if (!route.params.id) {
      folder.value = null;
      return;
    }
    if (loading.value) return;
    loading.value = true;
    const { data } = await useFetch<Folder>(
      `/api/folder/${route.params.bucket}/${route.params.id}`
    );
    if (data.value) folder.value = data.value;
    loading.value = false;
  };

  watch(
    () => route.params.id,
    (newId, oldId) => {
      fetchFolder();
    }
  );
  onMounted(() => {
    fetchFolder();
  });
  return { loading, folder };
};
