CREATE TABLE `website` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`file_id` text NOT NULL,
	`domain` text NOT NULL,
	`bucket_name` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `website_file_id_unique` ON `website` (`file_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `website_domain_unique` ON `website` (`domain`);