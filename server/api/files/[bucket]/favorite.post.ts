export default defineEventHandler(async (event) => {
  const { bucket, user } = await verifyBucket(event);
  // @ts-ignore
  const userId = user.id;
  const { file, add } = await readBody(event);
  if (file) {
    await ensureFile(bucket.name, file);
    const response = add
      ? await setFavorite(userId, file)
      : await unsetFavorite(userId, file);
    if (response.success) {
      return {
        status: "success",
      };
    }
  }
});
