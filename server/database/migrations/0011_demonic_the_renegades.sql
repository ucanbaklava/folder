DROP INDEX `files_path_unique`;--> statement-breakpoint
ALTER TABLE `files` ADD `metadata` text;--> statement-breakpoint
CREATE INDEX `idx_files_parent_id` ON `files` (`parent_id`);--> statement-breakpoint
CREATE INDEX `idx_files_bucket_user` ON `files` (`bucket_name`,`user_id`);--> statement-breakpoint
CREATE INDEX `idx_files_deleted_at` ON `files` (`deleted_at`);--> statement-breakpoint
CREATE INDEX `idx_files_name` ON `files` (`name`);--> statement-breakpoint
CREATE INDEX `idx_files_type_parent` ON `files` (`type`,`parent_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `files_path_deleted_at_unique` ON `files` (`path`,`deleted_at`);--> statement-breakpoint
CREATE INDEX `idx_favorites_user_id` ON `favorites` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_shared_user_id` ON `shared` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_shared_file_id` ON `shared` (`file_id`);