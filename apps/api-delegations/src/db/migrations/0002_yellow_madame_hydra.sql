ALTER TABLE "delegations" ADD COLUMN "verifyingContract" varchar(42) NOT NULL;--> statement-breakpoint
ALTER TABLE "delegations" ADD COLUMN "type" varchar(256) NOT NULL;