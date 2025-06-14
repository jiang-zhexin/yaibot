CREATE TABLE `inlines` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`title` text,
	`description` text,
	`entities` text,
	`file_id` text,
	`mark` integer
);
--> statement-breakpoint
CREATE INDEX `mark_idx` ON `inlines` (`mark`);--> statement-breakpoint
CREATE INDEX `type_idx` ON `inlines` (`type`);