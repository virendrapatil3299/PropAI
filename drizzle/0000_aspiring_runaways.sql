CREATE TABLE "listings" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"price" text NOT NULL,
	"location" text,
	"area" text,
	"url" text,
	"status_type" text,
	"img_src" text,
	"has_3d_model" text,
	"address_city" text,
	"address_street" text,
	"address_state" text,
	"address_zipcode" text,
	"lat" real,
	"lng" real,
	"baths" integer,
	"beds" integer,
	"home_type" text
);
--> statement-breakpoint
CREATE TABLE "saved_homes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"property_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
