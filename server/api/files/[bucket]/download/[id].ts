import { verifyBucket } from "~~/server/utils/permission";

export default defineEventHandler(async (event) => {
  const { bucket } = await verifyBucket(event);
  const { id } = await getRouterParams(event);

  if (id) {
    const item = await getFolder(id);
    if (item && item.bucketName === bucket.name) {
      // Set Content-Disposition to indicate this should be downloaded
      setHeader(
        event,
        "Content-Disposition",
        `attachment; filename="${encodeURIComponent(item.name)}"`
      );

      // Disable caching
      setHeader(event, "Cache-Control", "no-cache, no-store, must-revalidate");
      setHeader(event, "Pragma", "no-cache");
      setHeader(event, "Expires", "0");

      //   setHeader(event, "Content-Security-Policy", "default-src 'none';");
      return hubBlob().serve(event, item.path);
    }
  } else {
    throw createError({
      message: "Invalid request",
      status: 400,
    });
  }
});
