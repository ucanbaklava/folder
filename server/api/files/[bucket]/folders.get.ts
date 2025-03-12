import { getNestedFolders } from "~~/server/utils/db";
import { verifyBucket } from "~~/server/utils/permission";

export default defineEventHandler(async (event) => {
  const { bucket, user } = await verifyBucket(event);
  //@ts-ignore
  return await getNestedFolders(bucket.name, user.id);
});
