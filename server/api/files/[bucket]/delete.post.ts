import { deleteFiles } from "~~/server/utils/db";
import { verifyBucket } from "~~/server/utils/permission";

export default defineEventHandler(async (event) => {
  const { bucket } = await verifyBucket(event);
  const files = await readBody(event);
  const response = await deleteFiles(bucket.name, files);
  if (response.success) {
    return {
      status: "success",
    };
  }
});
