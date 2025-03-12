export const copyFile = async (bucket: string, file: string, name: string) => {
  const data = await $fetch(`/api/files/${bucket}/copy`, {
    method: "POST",
    body: JSON.stringify({ file, name }),
  });
};
