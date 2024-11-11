CREATE TABLE IF NOT EXISTS "dids" (
	"address" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"document" text NOT NULL,
	"signature" text NOT NULL
);
