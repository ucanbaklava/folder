import { getBucket } from "./db";

// @ts-ignore
export const getVerifiedUser = async (event) => {
  const { user } = await requireUserSession(event);
  if (!user) {
    throw createError({
      status: 401,
      message: "Unauthorized Access",
    });
  }
  return user;
};
// @ts-ignore
export const verifyBucket = async (event) => {
  const user = await getVerifiedUser(event);
  const params = getRouterParams(event);
  if (!params.bucket) {
    throw createError({
      status: 400,
      message: "Invalid Path",
    });
  }
  const bucket = await getBucket(params.bucket);
  if (!bucket) {
    throw createError({
      status: 404,
      message: "Bucket not found",
    });
  }
  // @ts-ignore
  if (bucket.userId !== user.id) {
    throw createError({
      status: 401,
      message: "Unauthorized",
    });
  }
  return { bucket, user };
};
