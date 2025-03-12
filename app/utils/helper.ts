export const formatBytes = (bytes: number) => {
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Bytes";
  const i = Math.floor(Math.log10(bytes) / 3); // Logarithmic base 10, divide by 3 for 1000, 1,000,000, etc.
  return parseFloat((bytes / Math.pow(1000, i)).toFixed(2)) + " " + sizes[i];
};
