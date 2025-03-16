import { asc, eq, ne, sql, and, desc, inArray } from "drizzle-orm";
import { ulid } from "ulidx";
import { users, files, buckets, favorites, shared } from "../database/schema";

const perPage = 12;

const fileColumns = {
  id: files.id,
  name: files.name,
  path: files.path,
  type: files.type,
  contentType: files.contentType,
  size: files.size,
  preview: files.preview,
  visibility: files.visibility,
  sharedCount: files.sharedCount,
  count: files.count,
  createdAt: files.createdAt,
  updatedAt: files.updatedAt,
};

export async function createUser(data: CreateUserType) {
  return await useDrizzle().insert(users).values(data);
}

export async function getUserByEmail(email: string) {
  const result = await useDrizzle()
    .select()
    .from(users)
    .where(eq(users.email, email));
  if (result && result.length >= 0) {
    return result[0];
  }
  return null;
}

export async function getUser(id: string) {
  const result = await useDrizzle()
    .select()
    .from(users)
    .where(eq(users.id, id));
  if (result && result.length > 0) {
    return result[0];
  }
  return null;
}

export const makeSorting = (dbQuery: any, model: any, queryString: any) => {
  const { sortBy, order = "desc" } = queryString;

  const sortColumn =
    typeof sortBy === "string" && model[sortBy]
      ? model[sortBy]
      : model.createdAt;

  if (sortColumn) {
    return dbQuery.orderBy(
      order === "asc" ? asc(sortColumn) : desc(sortColumn)
    );
  }
  dbQuery;
};

export const makePaginate = (dbQuery: any, queryString: any) => {
  const { page = 1 } = queryString;

  if (Number(page) <= 0) {
    throw createError({
      status: 404,
      message: "Invalid Request",
    });
  }

  const offset = (Number(page) - 1) * Number(perPage);
  return dbQuery.limit(Number(perPage)).offset(offset);
};

export const getBucket = async (name: string) => {
  const result = await useDrizzle()
    .select()
    .from(buckets)
    .where(eq(buckets.name, name));
  if (result && result.length > 0) {
    return result[0];
  }
  return null;
};
export const getBucketSize = async (bucketName: string) => {
  const result = await useDrizzle()
    .select({
      size: sql`SUM(${files.size})`,
    })
    .from(files)
    .where(and(eq(files.bucketName, bucketName), ne(files.type, "folder")));
  if (result && result.length > 0) {
    return result[0].size || 0;
  }
  return 0;
};
export const getUserBucket = async (userId: string) => {
  try {
    const result = await useDrizzle()
      .select()
      .from(buckets)
      .where(eq(buckets.userId, userId));
    if (result && result.length > 0) {
      const size = await getBucketSize(result[0].name);

      return {
        ...result[0],
        size,
      };
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createBucket = async (name: string, userId: string) => {
  const hasBucket = await getBucket(name);
  if (hasBucket) {
    throw createError({
      status: 400,
      message: "Bucket already exists",
    });
  }
  const response = await useDrizzle()
    .insert(buckets)
    .values({
      id: ulid() as string,
      name,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
  if (response && response.length > 0) {
    return response[0];
  }
};

// @ts-ignore
export const getFiles = async (event, userId) => {
  const queryString = getQuery(event);
  const params = getRouterParams(event);

  const filters = [];

  let dataQuery = useDrizzle()
    .select({
      ...fileColumns,
      isFavorite: favorites.createdAt,
    })
    .from(files)
    .leftJoin(
      favorites,
      and(eq(files.id, favorites.fileId), eq(favorites.userId, userId))
    )
    .$dynamic();

  // 🔸 Filtering
  filters.push(eq(files.userId, userId));
  if (params.id) {
    filters.push(eq(files.parentId, params.id));
  } else {
    filters.push(eq(files.parentId, "root"));
  }
  if (queryString["filters[contentType]"]) {
    filters.push(
      eq(files.contentType, queryString["filters[contentType]"] as string)
    );
  }
  if (queryString["filters[shared]"]) {
    if (queryString["filters[shared]"] === "no")
      filters.push(eq(files.sharedCount, 0));
    if (queryString["filters[shared]"] === "yes")
      filters.push(ne(files.sharedCount, 0));
  }
  if (
    queryString["filters[visibility]"] &&
    ["public", "private"].includes(queryString["filters[visibility]"] as string)
  ) {
    filters.push(
      eq(files.visibility, queryString["filters[visibility]"] as string)
    );
  }
  dataQuery = dataQuery.where(and(...filters));

  // 🔸 Sorting
  dataQuery = makeSorting(dataQuery, files, queryString);

  // 🔸 Pagination
  dataQuery = makePaginate(dataQuery, queryString);

  const data = await dataQuery;

  const nextPage =
    data.length === perPage ? Number(queryString.page) + 1 : null;
  return {
    data,
    nextPage,
  };
};

export const getFile = async (bucketName: string, path: string) => {
  const result = await useDrizzle()
    .select()
    .from(files)
    .where(and(eq(files.bucketName, bucketName), eq(files.path, path)));
  if (result && result.length > 0) {
    return result[0];
  }
  return null;
};

export const getFolder = async (id: string) => {
  const result = await useDrizzle()
    .select()
    .from(files)
    .where(eq(files.id, id));
  if (result && result.length > 0) {
    return result[0];
  }
  return null;
};

export const ensurePath = async (
  bucketName: string,
  fullPath: string,
  userId: string,
  isFile?: boolean
) => {
  // pathShouldStartWithBucketName(bucketName, fullPath);
  // replace leading, trailing and duplicate slashes
  fullPath = cleanPath(fullPath);
  // Check and create parent folders if they don't exist
  const pathSegments = fullPath.split("/");
  // Remove the file name (last segment)
  if (isFile) pathSegments.pop();
  // const fileName = pathSegments.pop();
  let current = { id: "root", path: "" };
  // If there are path segments (not a root-level file)
  if (pathSegments.length > 1) {
    // Set the current path to the bucket
    current.path = pathSegments[0];
    // Iterate through each folder level
    for (let i = 1; i < pathSegments.length; i++) {
      // Build the current path level
      current.path = current.path
        ? `${current.path}/${pathSegments[i]}`
        : pathSegments[i];

      // Check if this folder level exists
      const folderExists = await getFile(bucketName, current.path);

      if (!folderExists) {
        // Create the missing folder
        const folderId = ulid() as string;
        const folderData = {
          id: folderId,
          name: pathSegments[i],
          path: current.path,
          type: "folder",
          contentType: "folder",
          size: 0,
          parentId: current.id,
          bucketName: bucketName,
          userId: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await useDrizzle().insert(files).values(folderData);
        current.id = folderId;
      } else {
        // If folder exists but isn't a folder type, throw error
        if (folderExists.type !== "folder") {
          throw createError({
            status: 400,
            message: `Path conflict: '${current.path}' exists but is not a folder`,
          });
        }
        current.id = folderExists.id;
        current.path = folderExists.path;
      }
    }
  }
  return current;
};

export const insertUpdateFile = async (
  bucketName: string,
  parentId: string,
  data: any
) => {
  const { userId } = data;
  // let parent = await getParent(bucketName, parentId);
  const path = cleanPath(data.fullPath);

  const file = await getFile(bucketName, path);
  if (file) {
    return await useDrizzle()
      .update(files)
      .set({
        size: data.size,
        updatedAt: new Date(),
      })
      .where(eq(files.path, path));
  }
  let parent = await ensurePath(bucketName, path, userId, true);
  const fileType = getFileType(data.contentType);
  const preview = fileType === "image" ? path : null;
  if (preview) {
    await setFolderThumbnail(parent.id, preview);
  }
  const insertFile = {
    id: ulid() as string,
    name: path.split("/").pop() || "",
    path: path,
    type: fileType,
    size: data.size,
    contentType: data.contentType,
    userId: data.userId,
    bucketName: bucketName,
    parentId: parent.id,
    createdAt: new Date(),
    updatedAt: new Date(),
    preview,
  };
  const response = await useDrizzle()
    .insert(files)
    .values(insertFile)
    .returning();
  if (response && response.length > 0) {
    await updateCount(parent.id);
    return response[0];
  }
};

export const getParent = async (bucketName: string, id: string) => {
  let parent = {
    path: bucketName,
    id: "root",
  };
  if (id && id !== "root") {
    const folder = await getFolder(id);
    if (
      folder &&
      folder.type === "folder" &&
      folder.bucketName === bucketName
    ) {
      parent = {
        path: folder.path,
        id: folder.id,
      };
    } else {
      throw createError({
        status: 404,
        message: "Folder not found",
      });
    }
  }
  return parent;
};

export const isParentPublic = async (
  bucketName: string,
  path: string
): Promise<boolean> => {
  const parentPath = path.split("/").slice(0, -1).join("/");
  if (parentPath) {
    const parent = await getFile(bucketName, parentPath);
    if (parent && parent.visibility === "public") {
      return true;
    }
    if (parent && parent.visibility === "inherit") {
      return await isParentPublic(bucketName, parentPath);
    }
  }
  return false;
};

export const searchFiles = async (bucketName: string, query: string) => {
  const filters = [];

  let dataQuery = useDrizzle()
    .select({
      id: files.id,
      name: files.name,
      path: files.path,
      type: files.type,
    })
    .from(files)
    .$dynamic();

  // 🔸 Filtering
  filters.push(eq(files.bucketName, bucketName));
  if (query) {
    filters.push(sql`LOWER(name) LIKE LOWER(${`%${query}%`})`);
  }
  dataQuery = dataQuery.where(and(...filters));

  const data = await dataQuery;
  return data;
};

export const deleteFiles = async (bucketName: string, items: string[]) => {
  // TODO: delete children also, if the type is folder
  // TODO: move files form bucket to trash
  return await useDrizzle()
    .delete(files)
    .where(and(eq(files.bucketName, bucketName), inArray(files.id, items)));
};

export const setFavorite = async (userId: string, fileId: string) => {
  const favorite = await useDrizzle()
    .select()
    .from(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.fileId, fileId)));
  if (favorite && favorite.length > 0) {
    return await useDrizzle()
      .update(favorites)
      .set({
        createdAt: new Date(),
      })
      .where(and(eq(favorites.userId, userId), eq(favorites.fileId, fileId)));
  } else {
    return await useDrizzle().insert(favorites).values({
      userId,
      fileId,
      createdAt: new Date(),
    });
  }
};
export const unsetFavorite = async (userId: string, fileId: string) => {
  return await useDrizzle()
    .delete(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.fileId, fileId)));
};
export const ensureFile = async (bucketName: string, id: string) => {
  const file = await getFolder(id);
  if (!file || file.bucketName !== bucketName) {
    throw createError({
      status: 404,
      message: "File not found",
    });
  }
  return file;
};

export const getBreadcrumb = async (bucketName: string, path: string) => {
  // Skip if path is empty or just the bucket
  if (!path || path === bucketName) return [];

  // Generate all potential parent paths
  const pathSegments = path.split("/");
  const pathsToQuery = [];

  for (let i = 1; i <= pathSegments.length; i++) {
    const currentPath = pathSegments.slice(0, i).join("/");
    if (currentPath && currentPath !== bucketName) {
      pathsToQuery.push(currentPath);
    }
  }

  if (pathsToQuery.length === 0) return [];

  // Query all paths in a single database call
  const breadcrumbFiles = await useDrizzle()
    .select({
      id: files.id,
      name: files.name,
      path: files.path,
      visibility: files.visibility,
      size: files.size,
      count: files.count,
    })
    .from(files)
    .where(
      and(eq(files.bucketName, bucketName), inArray(files.path, pathsToQuery))
    )
    .orderBy(sql`LENGTH(${files.path})`);

  // Sort breadcrumbs in path order since SQL might return in a different order
  const breadcrumbMap = breadcrumbFiles.reduce(
    (acc: { [key: string]: any }, file) => {
      acc[file.path] = file;
      return acc;
    },
    {}
  );

  // Now create the ordered breadcrumbs array
  const orderedBreadcrumbs = [];
  for (const currentPath of pathsToQuery) {
    if (breadcrumbMap[currentPath]) {
      orderedBreadcrumbs.push({
        id: breadcrumbMap[currentPath].id,
        name: breadcrumbMap[currentPath].name,
        visibility: breadcrumbMap[currentPath].visibility,
      });
    }
  }

  return orderedBreadcrumbs;
};

export const getFavorites = async (event: any, userId: string) => {
  const queryString = getQuery(event);
  const params = getRouterParams(event);
  let dataQuery = useDrizzle()
    .select({
      ...fileColumns,
      isFavorite: favorites.createdAt,
    })
    .from(favorites)
    .leftJoin(files, eq(favorites.fileId, files.id))
    .where(
      and(eq(favorites.userId, userId), eq(files.bucketName, params.bucket))
    )
    .$dynamic();

  // 🔸 Sorting
  dataQuery = makeSorting(dataQuery, files, queryString);

  // 🔸 Pagination
  dataQuery = makePaginate(dataQuery, queryString);

  const data = await dataQuery;

  const nextPage =
    data.length === perPage ? Number(queryString.page) + 1 : null;
  return {
    data,
    nextPage,
  };
};
export const getSharedWithMe = async (userId: string, queryString: any) => {
  let dataQuery = useDrizzle()
    .select({
      ...fileColumns,
      role: shared.role,
      sharedAt: shared.createdAt,
    })
    .from(shared)
    .leftJoin(files, eq(shared.fileId, files.id))
    .where(eq(shared.userId, userId))
    .$dynamic();

  // 🔸 Sorting
  dataQuery = makeSorting(dataQuery, files, queryString);

  // 🔸 Pagination
  dataQuery = makePaginate(dataQuery, queryString);

  const data = await dataQuery;

  const nextPage =
    data.length === perPage ? Number(queryString.page) + 1 : null;
  return {
    data,
    nextPage,
  };
};

export const getPublished = async (event: any, userId: string) => {
  const queryString = getQuery(event);
  const filters = [];

  let dataQuery = useDrizzle()
    .select({
      ...fileColumns,
      isFavorite: favorites.createdAt,
    })
    .from(files)
    .leftJoin(
      favorites,
      and(eq(files.id, favorites.fileId), eq(favorites.userId, userId))
    )
    .$dynamic();

  // 🔸 Filtering
  filters.push(eq(files.userId, userId));
  filters.push(eq(files.visibility, "public"));

  dataQuery = dataQuery.where(and(...filters));

  // 🔸 Sorting
  dataQuery = makeSorting(dataQuery, files, queryString);

  // 🔸 Pagination
  dataQuery = makePaginate(dataQuery, queryString);

  const data = await dataQuery;

  const nextPage =
    data.length === perPage ? Number(queryString.page) + 1 : null;
  return {
    data,
    nextPage,
  };
};
export const getRecent = async (event: any, userId: string) => {
  const queryString = getQuery(event);
  const filters = [];

  let dataQuery = useDrizzle()
    .select({
      ...fileColumns,
      isFavorite: favorites.createdAt,
    })
    .from(files)
    .leftJoin(
      favorites,
      and(eq(files.id, favorites.fileId), eq(favorites.userId, userId))
    )
    .$dynamic();

  // 🔸 Filtering
  filters.push(eq(files.userId, userId));
  dataQuery = dataQuery.where(and(...filters));

  // 🔸 Sorting
  dataQuery = dataQuery.orderBy(desc(files.updatedAt));

  // 🔸 Pagination
  dataQuery = makePaginate(dataQuery, queryString);

  const data = await dataQuery;

  const nextPage =
    data.length === perPage ? Number(queryString.page) + 1 : null;
  return {
    data,
    nextPage,
  };
};

export const setVisibility = async (bucketName: string, data: IFile) => {
  const file = await getFolder(data.id);
  if (file && file.bucketName === bucketName) {
    return await useDrizzle()
      .update(files)
      .set({
        visibility: data.visibility,
        updatedAt: new Date(),
      })
      .where(eq(files.id, file.id));
  }
};

export const shareFiles = async (
  bucketName: string,
  files: IFile[],
  members: Member[]
) => {};

export const getNestedFolders = async (bucketName: string, userId: string) => {
  const folders = await useDrizzle()
    .select()
    .from(files)
    .where(
      and(
        eq(files.bucketName, bucketName),
        eq(files.userId, userId),
        eq(files.type, "folder")
      )
    );
  if (folders && folders.length > 0) {
    return makeNested(folders, "root");
  }
  return [];
};

export const makeNested = (list: any[], parentId: string): any[] => {
  return list
    .filter((item) => item.parentId === parentId)
    .map((item: IFile) => ({
      id: item.id,
      path: item.path,
      label: item.name,
      icon: "lucide:folder",
      children: makeNested(list, item.id),
    }));
};

export const updateContentType = async (id: string, contentType: string) => {
  return await useDrizzle()
    .update(files)
    .set({
      contentType,
    })
    .where(eq(files.id, id));
};

export const getComputedVisibility = async (bucketName: string, file: any) => {
  if (file.visibility && file.visibility !== "inherit") {
    return file.visibility;
  }
  if (file.parentId === "root") {
    return "private";
  }
  const folderPath = file.path.split("/").slice(0, -1).join("/");
  const breadcrumb = await getBreadcrumb(bucketName, folderPath);
  return getVisibility(breadcrumb, file.visibility);
};

export const transformList = async (bucketName: string, files: any) => {
  const data = await Promise.all(
    files.data.map(async (file: any) => ({
      ...file,
      visibility: await getComputedVisibility(bucketName, file),
    }))
  );
  return { data, nextPage: files.nextPage };
};

export const setFolderThumbnail = async (id: string, previewUrl: string) => {
  // Get the folder
  const folder = await getFolder(id);

  if (folder && folder.type === "folder") {
    try {
      // Parse existing previews or initialize empty array
      let previews = [];
      if (folder.preview) {
        try {
          previews = JSON.parse(folder.preview);
          // Ensure it's an array
          if (!Array.isArray(previews)) {
            previews = [];
          }
        } catch (e) {
          // If parsing fails, start with empty array
          previews = [];
        }
      }

      // Check if the preview URL already exists in the array
      const existingIndex = previews.indexOf(previewUrl);

      // Only add if not already present and less than 4 previews
      if (existingIndex === -1 && previews.length < 4) {
        previews.push(previewUrl);
        // Update the folder in the database
        await useDrizzle()
          .update(files)
          .set({
            preview: JSON.stringify(previews),
            updatedAt: new Date(),
          })
          .where(eq(files.id, id));
      }
    } catch (error) {
      console.error("Error updating folder thumbnail:", error);
      throw error;
    }
  }
};

export const updateCount = async (id: string) => {
  if (id === "root") return;
  return await useDrizzle()
    .update(files)
    .set({
      count: sql`count + 1`,
    })
    .where(eq(files.id, id));
};
