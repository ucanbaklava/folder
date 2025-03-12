export default defineEventHandler(async (event) => {
  await verifyBucket(event);
  const params = getRouterParams(event);
  if (!params.path) {
    throw createError({
      status: 404,
      message: "Page not found",
    });
  }
  const fullPath = params.bucket + "/" + decodeURIComponent(params.path);
  const file = await getFile(params.bucket, fullPath);
  if (!file) {
    throw createError({
      status: 404,
      message: "Page not found",
    });
  }
  if (file.type !== "folder") {
    return await hubBlob().serve(event, fullPath);
  } else {
    throw createError({
      status: 404,
      message: "Not a File",
    });
  }
});
