CREATE TABLE `tickets` (
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`created_by` text NOT NULL,
	`description` text NOT NULL,
	`id` text(36) PRIMARY KEY NOT NULL,
	`status` text DEFAULT 'open' NOT NULL,
	`title` text NOT NULL,
	`updated_at` text DEFAULT (current_timestamp),
	`updated_by` text,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`email` text NOT NULL,
	`full_name` text NOT NULL,
	`id` text(36) PRIMARY KEY NOT NULL,
	`password` text NOT NULL
);
