export const formatBytes = (bytes: number) => {
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Bytes";
  const i = Math.floor(Math.log10(bytes) / 3); // Logarithmic base 10, divide by 3 for 1000, 1,000,000, etc.
  return parseFloat((bytes / Math.pow(1000, i)).toFixed(2)) + " " + sizes[i];
};

export const chunkSize = (
  fileSize: number,
  MIN_PART_SIZE: number = 10 * 1024 * 1024,
  MAX_PART_SIZE: number = 20 * 1024 * 1024
) => {
  const MAX_PARTS = 10000; // R2 limit for number of parts
  // Calculate optimal part size to avoid small last chunk
  let optimalPartSize = MIN_PART_SIZE;
  // If file size is known, calculate the optimal part size
  if (fileSize) {
    // Calculate how many parts we'd have with minimum size
    const partsCount = Math.ceil(fileSize / MIN_PART_SIZE);

    if (partsCount > 1) {
      // If we'll have more than one part, calculate a part size that
      // will make the last part at least MIN_PART_SIZE
      const idealPartSize = Math.ceil(
        fileSize / Math.floor(fileSize / MIN_PART_SIZE)
      );

      // Ensure part size isn't too large
      optimalPartSize = Math.min(idealPartSize, MAX_PART_SIZE);

      // Check if we'd exceed max parts with this size
      if (Math.ceil(fileSize / optimalPartSize) > MAX_PARTS) {
        // If so, adjust to max parts
        optimalPartSize = Math.ceil(fileSize / MAX_PARTS);
      }
    }
  }
  return optimalPartSize;
};
