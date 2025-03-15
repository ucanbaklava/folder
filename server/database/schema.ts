import { sqliteTable, text, integer, unique } from "drizzle-orm/sqlite-core";

const autoIncrement = integer({ mode: "number" }).primaryKey({
  autoIncrement: true,
});
const createdAt = integer("created_at", { mode: "timestamp" }).notNull();
const updatedAt = integer("updated_at", { mode: "timestamp" }).notNull();
const deletedAt = integer("deleted_at", { mode: "timestamp" });

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  avatar: text("avatar"),
  country: text("country"),
  status: text("status").default("active").notNull(),
  provider: text("provider"),
  createdAt: createdAt,
});

export const buckets = sqliteTable("buckets", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  userId: text("user_id").notNull(),
  size: integer("size").default(0).notNull(),
  count: integer("count").default(0).notNull(), // file /folder count in this folder
  createdAt: createdAt,
  updatedAt: updatedAt,
});

export const files = sqliteTable("files", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  contentType: text("content_type").notNull(),
  type: text("type").notNull(),
  size: integer("size").notNull(),
  path: text("path").notNull().unique(),
  visibility: text("visibility").default("inherit").notNull(), // public, private, inherit
  preview: text("preview"),
  dimensions: text("dimensions"),
  count: integer("count").default(0).notNull(), // file/folder count in this folder
  parentId: text("parent_id").default("root").notNull(),
  bucketName: text("bucket_name").notNull(),
  userId: text("user_id").notNull(),
  sharedCount: integer("shared_count").default(0).notNull(),
  createdAt: createdAt,
  updatedAt: updatedAt,
  deleteAt: deletedAt,
});

export const favorites = sqliteTable(
  "favorites",
  {
    id: autoIncrement,
    fileId: text("file_id").notNull(),
    userId: text("user_id").notNull(),
    createdAt: createdAt,
  },
  (t) => [unique().on(t.fileId, t.userId)]
);

export const shared = sqliteTable(
  "shared",
  {
    id: autoIncrement,
    fileId: text("file_id").notNull(),
    userId: text("user_id").notNull(),
    role: text("role").default("viewer").notNull(),
    createdAt: createdAt,
  },
  (t) => [unique().on(t.fileId, t.userId)]
);

export const website = sqliteTable("website", {
  id: autoIncrement,
  fileId: text("file_id").notNull().unique(),
  domain: text("domain").notNull().unique(),
  bucketName: text("bucket_name").notNull(),
  createdAt: createdAt,
});
