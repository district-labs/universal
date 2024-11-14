CREATE TABLE IF NOT EXISTS "credentials" (
	"id" serial PRIMARY KEY NOT NULL,
	"issuer" varchar(255) NOT NULL,
	"subject" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"category" varchar(255) NOT NULL,
	"credential" jsonb NOT NULL
);
