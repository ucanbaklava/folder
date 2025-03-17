import { verifyBucket } from "~~/server/utils/permission";

export default defineEventHandler(async (event) => {
  const { bucket } = await verifyBucket(event);
  const { id } = getRouterParams(event);

  if (id) {
    const file = await getFolder(id);
    if (file && file.bucketName === bucket.name) {
      return file;
    }
  } else {
    throw createError({
      message: "Invalid request",
      status: 400,
    });
  }
});
