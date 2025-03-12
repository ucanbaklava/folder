export default defineEventHandler(async (event) => {
  const { bucket } = await verifyBucket(event);
  const body = await readBody(event);
  if (body.file) {
    const file = await ensureFile(bucket.name, body.file.id);
    throw createError({
      status: 500,
      message: "Can't make copy",
    });
  }
});
