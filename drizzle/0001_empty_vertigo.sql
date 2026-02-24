CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`icon` text DEFAULT '📦' NOT NULL,
	`color` text DEFAULT '#6b7280' NOT NULL,
	`is_system` integer DEFAULT false NOT NULL
);
