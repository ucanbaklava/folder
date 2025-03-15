export const cleanPath = (path: string) => {
  // replace leading, trailing and duplicate slashes
  return path.replace(/\/+/g, "/").replace(/^\/|\/$/g, "");
};

export const pathShouldStartWithBucketName = (
  bucketName: string,
  path: string
) => {
  if (!path.startsWith(bucketName + "/")) {
    return path;
  } else {
    throw createError({
      status: 400,
      message: "Path Missing Bucket Name",
    });
  }
};

export const getPreviewUrl = (path: string) => {
  return "/preview/" + encodeURI(path);
};

export const encodeURI = (path: string) => {
  return path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
};

export const fileIcon = (type: string): string => {
  // @ts-ignore
  return fileIcons[fileTypes[type]] || fileIcons["default"];
};

export const getFolderPath = (path: string) => {
  const pathParts = path.split("/");

  // Remove the last segment (filename)
  pathParts.pop();

  // Join the remaining path segments
  return pathParts.join("/");
};

export const getFileType = (path: string) => {
  const extension = path.split(".").pop()?.toLowerCase();
  // @ts-ignore
  return allowedExtensions[extension] || "application/octet-stream";
};

export const getVisibility = (
  breadcrumb: FolderBreadcrumb[],
  visibility: string
) => {
  if (visibility && visibility !== "inherit") {
    return visibility;
  }
  if (!breadcrumb || breadcrumb.length === 0) {
    return "private";
  }
  const reversedBreadcrumb = [...breadcrumb].reverse();
  for (const folder of reversedBreadcrumb) {
    if (folder.visibility && folder.visibility !== "inherit") {
      return folder.visibility;
    }
  }
  return "private";
};
