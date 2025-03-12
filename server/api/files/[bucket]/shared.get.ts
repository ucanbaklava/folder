import { getSharedWithMe } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
  // bucket is not required
  const user = await getVerifiedUser(event);
  const queryString = getQuery(event);

  //@ts-ignore
  return await getSharedWithMe(user.id, queryString);
});
