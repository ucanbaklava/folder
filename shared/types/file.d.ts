type FileVisibility = "public" | "private" | "inherit";
type FileTypes = "image" | "video" | "audio" | "document" | "folder" | "other";

interface IFile {
  id: string;
  name: string;
  path: string;
  type: string;
  contentType: string;
  size?: number;
  dimensions?: string;
  preview?: string;
  visibility: FileVisibility;
  count?: number;
  sharedCount?: number;
  bucketName: string;
  isFavorite?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface FilesFetchResponse {
  data: IFile[];
  nextPage?: boolean;
}
