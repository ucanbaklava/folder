import { shareFiles } from "~~/server/utils/db";
import { verifyBucket } from "~~/server/utils/permission";

export default defineEventHandler(async (event) => {
  const { bucket } = await verifyBucket(event);
  const { files, members } = await readBody(event);
  const response = await shareFiles(bucket.name, files, members);
  if (response.success) {
    return {
      status: "success",
    };
  }
});
