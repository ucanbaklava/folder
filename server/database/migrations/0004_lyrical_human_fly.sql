ALTER TABLE `files` RENAME COLUMN "folder_id" TO "parent_id";--> statement-breakpoint
ALTER TABLE `files` ADD `bucket_name` text NOT NULL;