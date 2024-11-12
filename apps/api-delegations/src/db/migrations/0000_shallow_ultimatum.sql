CREATE TABLE IF NOT EXISTS "caveats" (
	"id" serial PRIMARY KEY NOT NULL,
	"enforcerType" varchar(256) NOT NULL,
	"enforcer" varchar(42) NOT NULL,
	"terms" text NOT NULL,
	"args" text NOT NULL,
	"delegationHash" varchar(66) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "delegations" (
	"hash" varchar(66) PRIMARY KEY NOT NULL,
	"delegator" varchar(42) NOT NULL,
	"chainId" integer DEFAULT 84532 NOT NULL,
	"delegate" varchar(42) NOT NULL,
	"authority" varchar(66) NOT NULL,
	"salt" bigint NOT NULL,
	"signature" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "caveats" ADD CONSTRAINT "caveats_delegationHash_delegations_hash_fk" FOREIGN KEY ("delegationHash") REFERENCES "public"."delegations"("hash") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
