import { isParentPublic } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
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
  // check if the file is public.
  if (file.visibility === "public") {
    return await hubBlob().serve(event, `${params.bucket}/${params.path}`);
  }
  const isPublic = await isParentPublic(params.bucket, params.path);
  if (!isPublic) {
    throw createError({
      status: 404,
      message: "Page not found",
    });
  }
  if (file.type === "folder") {
    // Create Index if has index.html
    const indexFile = await getFile(params.bucket, `${params.path}/index.html`);
    if (indexFile) {
      return await hubBlob().serve(
        event,
        `${params.bucket}/${params.path}/index.html`
      );
    }
  } else {
    return await hubBlob().serve(event, `${params.bucket}/${params.path}`);
  }
});
