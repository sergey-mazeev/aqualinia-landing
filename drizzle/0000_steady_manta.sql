CREATE TABLE `leads` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`source` text NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`contact_method` text NOT NULL,
	`comment` text,
	`product_sku` text,
	`quantity` integer,
	`quiz_answers` text,
	`recommended_skus` text,
	`locale` text NOT NULL,
	`utm_source` text,
	`utm_medium` text,
	`utm_campaign` text,
	`utm_term` text,
	`utm_content` text,
	`referrer` text,
	`page_path` text,
	`status` text DEFAULT 'new' NOT NULL,
	`admin_note` text,
	`consent_at` integer NOT NULL,
	`consent_version` text NOT NULL,
	`ip_hash` text,
	`user_agent` text,
	`search_text` text NOT NULL,
	`client_submission_id` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `leads_client_submission_id_unique` ON `leads` (`client_submission_id`);--> statement-breakpoint
CREATE INDEX `leads_created_at_idx` ON `leads` (`created_at`);--> statement-breakpoint
CREATE INDEX `leads_status_idx` ON `leads` (`status`);--> statement-breakpoint
CREATE INDEX `leads_source_idx` ON `leads` (`source`);