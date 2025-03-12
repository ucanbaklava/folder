import { insertUpdateFile, updateContentType } from "~~/server/utils/db";

export default eventHandler(async (event) => {
  const { user } = await verifyBucket(event);
  // @ts-ignore
  const userId = user.id;
  const { bucket, id } = getRouterParams(event);
  let folderPath = "";
  if (id !== "root") {
    const folder = await getFolder(id);
    if (!folder) {
      throw createError({
        status: 404,
        message: "Folder not found",
      });
    }
    folderPath = folder.path;
  }
  const prefix = `${bucket}/${folderPath}`;

  const response = await hubBlob().handleMultipartUpload(event);
  if (response.action === "complete") {
    // Remove the prefix only from the start of the pathname
    const contentType =
      response.data.contentType || getFileType(response.data.pathname);
    const file = await insertUpdateFile(bucket, id, {
      ...response.data,
      fullPath: response.data.pathname,
      contentType,
      userId,
    });
    if (file && file.id) {
      const metadata = await hubBlob().head(file.path);
      if (
        metadata &&
        metadata.contentType &&
        metadata.contentType !== contentType &&
        metadata.contentType !== "application/octet-stream"
      ) {
        await updateContentType(file.id, metadata.contentType);
      }
    }
  }
  return response;
});
