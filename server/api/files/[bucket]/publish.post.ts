import { setVisibility } from "~~/server/utils/db";
import { verifyBucket } from "~~/server/utils/permission";

export default defineEventHandler(async (event) => {
  const { bucket } = await verifyBucket(event);
  const file = await readBody(event);
  const response = await setVisibility(bucket.name, file);
  if (response.success) {
    return {
      status: "success",
    };
  }
});
