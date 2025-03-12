CREATE TABLE `files` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`content_type` text NOT NULL,
	`type` text NOT NULL,
	`size` integer NOT NULL,
	`path` text NOT NULL,
	`visibility` text DEFAULT 'private' NOT NULL,
	`preview` text,
	`dimensions` text,
	`count` integer DEFAULT 0 NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
