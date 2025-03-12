import { getUserBucket } from "~~/server/utils/db";
import { getVerifiedUser } from "~~/server/utils/permission";

export default defineEventHandler(async (event) => {
  const user = await getVerifiedUser(event);
  // @ts-ignore
  return await getUserBucket(user.id);
});
