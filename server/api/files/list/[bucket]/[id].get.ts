import { getFiles } from "~~/server/utils/db";
import { verifyBucket } from "~~/server/utils/permission";

export default defineEventHandler(async (event) => {
  const { user } = await verifyBucket(event);
  //@ts-ignore
  return await getFiles(event, user.id);
});
