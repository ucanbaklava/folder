import { getFolder, getBreadcrumb } from "~~/server/utils/db";
import { verifyBucket } from "~~/server/utils/permission";

export default defineEventHandler(async (event) => {
  const { user } = await verifyBucket(event);
  const params = getRouterParams(event);

  try {
    const folder = await getFolder(params.id);
    // @ts-ignore
    if (folder && folder.userId === user.id) {
      const breadcrumb = await getBreadcrumb(params.bucket, folder.path);
      return {
        id: folder.id,
        name: folder.name,
        path: folder.path,
        breadcrumb,
      };
    }
    return null;
  } catch (err) {
    // console.error("Error fetching folder:", err);
    return null;
  }
});
