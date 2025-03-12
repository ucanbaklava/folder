CREATE TABLE `buckets` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`user_id` text NOT NULL,
	`size` integer DEFAULT 0 NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `buckets_name_unique` ON `buckets` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `files_path_unique` ON `files` (`path`);